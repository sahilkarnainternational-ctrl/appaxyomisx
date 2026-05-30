import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy YouTube Search
  app.post("/api/youtube", async (req, res) => {
    try {
      const { query } = req.body;
      const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "YouTube API Key not configured" });
      }

      const searchQuery = encodeURIComponent(`${query} educational lecture study class`);
      const youtubeRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: query,
          maxResults: 25,
          type: 'video',
          videoEmbeddable: 'true',
          key: apiKey
        }
      });
      
      const items = youtubeRes.data.items || [];
      const videos = items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || '',
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description || ''
      }));
      res.json({ videos });
    } catch (e: any) {
      console.error('YouTube Proxy Error:', e.response?.data || e.message);
      res.status(500).json({ error: "Failed to fetch YouTube videos" });
    }
  });

  // Proxy YouTube Multilingual Search
  app.post("/api/youtube-multilingual", async (req, res) => {
    try {
      const { topic, level } = req.body;
      const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "YouTube API Key not configured" });
      }

      const levelStr = level ? ` ${level} level` : '';

      const fetchLang = async (langQuery: string) => {
        try {
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              maxResults: 6,
              q: `${topic}${levelStr} ${langQuery}`,
              type: 'video',
              key: apiKey,
              videoEmbeddable: 'true',
              safeSearch: 'strict',
              order: 'relevance'
            }
          });

          return response.data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description
          }));
        } catch (error: any) {
          console.error(`YouTube Search Error (${langQuery}):`, error.response?.data || error.message);
          return [];
        }
      };

      const [english, hindi, nepali] = await Promise.all([
        fetchLang('full course or lecture in English'),
        fetchLang('full course or lecture in Hindi'),
        fetchLang('educational explanation in Nepali')
      ]);

      res.json({ english, hindi, nepali });
    } catch (e: any) {
      console.error('YouTube Proxy Error:', e);
      res.status(500).json({ error: "Failed to fetch YouTube videos" });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
