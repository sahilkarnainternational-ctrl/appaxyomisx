import axios from 'axios';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
}

export interface VideoGroup {
  english: YouTubeVideo[];
  hindi: YouTubeVideo[];
  nepali: YouTubeVideo[];
}

export async function fetchMultilingualVideos(topic: string, level: string = ''): Promise<VideoGroup> {
  try {
    const response = await axios.post('/api/youtube-multilingual', { topic, level });
    return response.data;
  } catch (error) {
    console.error('YouTube Proxy Request Error:', error);
    return { english: [], hindi: [], nepali: [] };
  }
}