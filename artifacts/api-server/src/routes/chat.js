import { Router } from "express";

async function* streamGroqToFrontend(messages) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const systemPrompt = `You are ASTRA — a brilliant, warm, and highly knowledgeable AI science tutor and assistant for Axyomis-X. 

RULES:
1. Answer EVERY question clearly and helpfully — greetings, casual chat, science, math, history, anything.
2. For casual greetings ("hi", "hello", "how are you") — reply naturally and warmly, keep it short.
3. For science/educational topics — give detailed, structured answers using markdown: headers, bullet points, bold text.
4. For math — use clear notation and step-by-step working.
5. You can describe diagrams using ASCII art or structured text.
6. If asked who you are — say you are ASTRA, the AI inside Axyomis-X, created to help students learn.
7. ALWAYS respond in the same language the user writes in.
8. Keep voice-friendly responses concise (under 200 words when voice is on).
9. NEVER say you cannot answer — always try your best.`;

    const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: groqMessages,
            max_tokens: 2048,
            temperature: 0.7,
            stream: true,
        }),
    });

    if (!groqRes.ok) {
        const errorText = await groqRes.text();
        console.error("Groq API error:", errorText);
        throw new Error(`Groq API request failed with status ${groqRes.status}`);
    }

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const data = line.substring(6);
                if (data.trim() === "[DONE]") {
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                        const frontendChunk = { text: content };
                        yield `data: ${JSON.stringify(frontendChunk)}\n\n`;
                    }
                } catch (e) {
                    console.error("Error parsing Groq stream chunk:", e);
                }
            }
        }
    }
}

const router = Router();

router.post("/chat", async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "messages array is required" });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const chunk of streamGroqToFrontend(messages)) {
            res.write(chunk);
        }
        res.end();

    } catch (err) {
        console.error("Chat API error:", err.message);
        if (!res.headersSent) {
            res.status(500).json({ error: err?.message ?? "Internal server error" });
        } else {
            res.end();
        }
    }
});

export default router;
