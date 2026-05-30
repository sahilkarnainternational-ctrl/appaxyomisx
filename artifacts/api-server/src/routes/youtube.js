"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.post("/youtube-multilingual", async (req, res) => {
    try {
        const { topic, level } = req.body;
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.error("YouTube API Key not configured");
            res.status(500).json({ error: "YouTube API Key not configured" });
            return;
        }
        const levelStr = level ? ` ${level} level` : "";
        const fetchLang = async (langQuery) => {
            try {
                const response = await axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
                    params: {
                        part: "snippet",
                        maxResults: 8,
                        q: `${topic}${levelStr} ${langQuery} full lecture explained tutorial`,
                        type: "video",
                        key: apiKey,
                        videoEmbeddable: "true",
                        videoSyndicated: "true",
                        safeSearch: "strict",
                        order: "relevance",
                        videoDuration: "medium",
                        videoCategoryId: "27",
                    },
                });
                const items = response.data.items || [];
                return items.map((item) => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails?.medium?.url || "",
                    channelTitle: item.snippet.channelTitle,
                    publishedAt: item.snippet.publishedAt,
                    description: item.snippet.description || "",
                }));
            }
            catch (error) {
                console.error(`Failed to fetch videos for query: ${langQuery}`, error);
                return []; // Return empty array on error
            }
        };
        const [english, hindi, nepali] = await Promise.allSettled([
            fetchLang("educational lecture study"),
            fetchLang("शिक्षा हिंदी"),
            fetchLang("शिक्षा नेपाली"),
        ]);
        res.json({
            english: english.status === "fulfilled" ? english.value : [],
            hindi: hindi.status === "fulfilled" ? hindi.value : [],
            nepali: nepali.status === "fulfilled" ? nepali.value : [],
        });
    }
    catch (e) {
        console.error({ err: e }, "YouTube multilingual proxy error");
        res.status(500).json({ error: "Failed to fetch YouTube videos" });
    }
});
router.post("/youtube", async (req, res) => {
    try {
        const { query } = req.body;
        const apiKey = process.env.YOUTUBE_API_KEnpmY;
        if (!apiKey) {
            console.error("YouTube API Key not configured");
            res.status(500).json({ error: "YouTube API Key not configured" });
            return;
        }
        const response = await axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: `${query} educational lecture study class`,
                maxResults: 25,
                type: "video",
                videoEmbeddable: "true",
                videoSyndicated: "true",
                safeSearch: "strict",
                key: apiKey,
            },
        });
        const items = response.data.items || [];
        const videos = items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url || "",
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description || "",
        }));
        res.json({ videos });
    }
    catch (e) {
        console.error({ err: e }, "YouTube proxy error");
        res.status(500).json({ error: "Failed to fetch YouTube videos" });
    }
});
exports.default = router;
