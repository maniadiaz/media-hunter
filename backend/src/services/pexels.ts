import axios from 'axios';
import { MediaItem, SearchParams, DownloadOption } from '../types/media';

const BASE_URL = 'https://api.pexels.com';

function getApiKey(): string {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error('PEXELS_API_KEY is not configured');
  return key;
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  duration: number;
  user: { name: string; url: string };
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
    size: number;
  }[];
  video_pictures: { picture: string }[];
}

function mapPhoto(photo: PexelsPhoto): MediaItem {
  const downloads: DownloadOption[] = [
    { label: 'Original', url: photo.src.original, format: 'jpg', quality: 'original', width: photo.width, height: photo.height },
    { label: 'Large', url: photo.src.large2x, format: 'jpg', quality: 'large' },
    { label: 'Medium', url: photo.src.medium, format: 'jpg', quality: 'medium' },
    { label: 'Small', url: photo.src.small, format: 'jpg', quality: 'small' },
  ];

  return {
    id: `pexels-photo-${photo.id}`,
    type: 'image',
    source: 'pexels',
    title: photo.alt || `Pexels Photo ${photo.id}`,
    thumbnail: photo.src.tiny,
    preview: photo.src.medium,
    author: photo.photographer,
    authorUrl: photo.photographer_url,
    sourceUrl: photo.url,
    downloads,
    width: photo.width,
    height: photo.height,
  };
}

function mapVideo(video: PexelsVideo): MediaItem {
  const downloads: DownloadOption[] = video.video_files
    .sort((a, b) => (b.width || 0) - (a.width || 0))
    .map((f) => ({
      label: `${f.quality} (${f.width}x${f.height})`,
      url: f.link,
      format: f.file_type.split('/')[1] || 'mp4',
      quality: f.quality,
      width: f.width,
      height: f.height,
      size: f.size,
    }));

  return {
    id: `pexels-video-${video.id}`,
    type: 'video',
    source: 'pexels',
    title: `Pexels Video ${video.id}`,
    thumbnail: video.video_pictures?.[0]?.picture || '',
    preview: video.video_files.find((f) => f.quality === 'sd')?.link || video.video_files[0]?.link || '',
    author: video.user.name,
    authorUrl: video.user.url,
    sourceUrl: video.url,
    downloads,
    duration: video.duration,
    width: video.width,
    height: video.height,
  };
}

export async function searchPexelsPhotos(params: SearchParams): Promise<{ items: MediaItem[]; total: number }> {
  const { query, page = 1, perPage = 15, orientation, color } = params;
  const apiKey = getApiKey();

  const response = await axios.get(`${BASE_URL}/v1/search`, {
    headers: { Authorization: apiKey },
    params: {
      query,
      page,
      per_page: perPage,
      ...(orientation && { orientation }),
      ...(color && { color }),
    },
  });

  return {
    items: response.data.photos.map(mapPhoto),
    total: response.data.total_results,
  };
}

export async function searchPexelsVideos(params: SearchParams): Promise<{ items: MediaItem[]; total: number }> {
  const { query, page = 1, perPage = 15, orientation } = params;
  const apiKey = getApiKey();

  const response = await axios.get(`${BASE_URL}/videos/search`, {
    headers: { Authorization: apiKey },
    params: {
      query,
      page,
      per_page: perPage,
      ...(orientation && { orientation }),
    },
  });

  return {
    items: response.data.videos.map(mapVideo),
    total: response.data.total_results,
  };
}

export async function searchPexels(params: SearchParams): Promise<{ items: MediaItem[]; total: number }> {
  const type = params.type || 'all';

  if (type === 'image') return searchPexelsPhotos(params);
  if (type === 'video') return searchPexelsVideos(params);

  // Search both
  const [photos, videos] = await Promise.allSettled([
    searchPexelsPhotos(params),
    searchPexelsVideos(params),
  ]);

  const items: MediaItem[] = [];
  let total = 0;

  if (photos.status === 'fulfilled') {
    items.push(...photos.value.items);
    total += photos.value.total;
  }
  if (videos.status === 'fulfilled') {
    items.push(...videos.value.items);
    total += videos.value.total;
  }

  return { items, total };
}
