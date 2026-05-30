import axios from 'axios';
import { getCache, setCache } from '../lib/cache';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const fetchVideos = async (query, lang) => {
    const cacheKey = `youtube-${query}-${lang}`;
    const cached = await getCache(cacheKey, 3600); // Cache for 1 hour
    if (cached) {
        return JSON.parse(cached);
    }
    try {
        const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                videoEmbeddable: 'true',
                maxResults: 5,
                key: YOUTUBE_API_KEY,
                safeSearch: 'strict',
                relevanceLanguage: lang,
            },
        });
        const videos = response.data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
        }));
        await setCache(cacheKey, JSON.stringify(videos));
        return videos;
    }
    catch (error) {
        console.error(`Error fetching YouTube videos for query "${query}" in ${lang}:`, error);
        return [];
    }
};
export const fetchMultilingualVideos = async (query) => {
    const [englishVideos, hindiVideos, nepaliVideos] = await Promise.all([
        fetchVideos(query, 'en'),
        fetchVideos(query, 'hi'),
        fetchVideos(query, 'ne'),
    ]);
    return {
        english: englishVideos,
        hindi: hindiVideos,
        nepali: nepaliVideos,
    };
};
