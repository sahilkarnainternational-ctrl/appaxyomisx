"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const router = (0, express_1.Router)();
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;
        if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                lastMessage.content += "\n\nAfter your response, please provide a list of 3-5 related topics for further study. Present them in a numbered list under the heading '## Related Topics'.";
            }
        }
        const stream = await groq.chat.completions.create({
            messages,
            model: 'llama3-8b-8192',
            stream: true,
        });
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }
        res.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.default = router;
