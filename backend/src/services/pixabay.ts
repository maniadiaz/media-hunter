import axios from 'axios';
import { MediaItem, SearchParams, DownloadOption } from '../types/media';

const BASE_URL = 'https://pixabay.com/api';

function getApiKey(): string {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error('PIXABAY_API_KEY is not configured');
  return key;
}

interface PixabayImage {
  id: number;
  pageURL: string;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  fullHDURL?: string;
  imageURL?: string;
  imageWidth: number;
  imageHeight: number;
  user: string;
  userImageURL: string;
}

interface PixabayVideo {
  id: number;
  pageURL: string;
  tags: string;
  duration: number;
  user: string;
  userImageURL: string;
  videos: {
    large: { url: string; width: number; height: number; size: number };
    medium: { url: string; width: number; height: number; size: number };
    small: { url: string; width: number; height: number; size: number };
    tiny: { url: string; width: number; height: number; size: number };
  };
}

interface PixabayMusic {
  id: number;
  pageURL: string;
  tags: string;
  duration: number;
  user: string;
  audio: string;
  previewURL: string;
}

function mapImage(img: PixabayImage): MediaItem {
  const downloads: DownloadOption[] = [
    { label: 'Full HD', url: img.fullHDURL || img.largeImageURL, format: 'jpg', quality: 'fullhd', width: img.imageWidth, height: img.imageHeight },
    { label: 'Large', url: img.largeImageURL, format: 'jpg', quality: 'large' },
    { label: 'Web', url: img.webformatURL, format: 'jpg', quality: 'web' },
  ];

  return {
    id: `pixabay-img-${img.id}`,
    type: 'image',
    source: 'pixabay',
    title: img.tags.split(',')[0]?.trim() || `Pixabay Image ${img.id}`,
    thumbnail: img.previewURL,
    preview: img.webformatURL,
    author: img.user,
    sourceUrl: img.pageURL,
    downloads,
    width: img.imageWidth,
    height: img.imageHeight,
    tags: img.tags.split(',').map((t) => t.trim()),
  };
}

function mapVideo(vid: PixabayVideo): MediaItem {
  const downloads: DownloadOption[] = [];
  if (vid.videos.large?.url) {
    downloads.push({ label: 'Large', url: vid.videos.large.url, format: 'mp4', quality: 'large', width: vid.videos.large.width, height: vid.videos.large.height, size: vid.videos.large.size });
  }
  if (vid.videos.medium?.url) {
    downloads.push({ label: 'Medium', url: vid.videos.medium.url, format: 'mp4', quality: 'medium', width: vid.videos.medium.width, height: vid.videos.medium.height, size: vid.videos.medium.size });
  }
  if (vid.videos.small?.url) {
    downloads.push({ label: 'Small', url: vid.videos.small.url, format: 'mp4', quality: 'small', width: vid.videos.small.width, height: vid.videos.small.height, size: vid.videos.small.size });
  }

  return {
    id: `pixabay-vid-${vid.id}`,
    type: 'video',
    source: 'pixabay',
    title: vid.tags.split(',')[0]?.trim() || `Pixabay Video ${vid.id}`,
    thumbnail: vid.videos.tiny?.url || vid.videos.small?.url || '',
    preview: vid.videos.small?.url || vid.videos.medium?.url || '',
    author: vid.user,
    sourceUrl: vid.pageURL,
    downloads,
    duration: vid.duration,
    tags: vid.tags.split(',').map((t) => t.trim()),
  };
}

export async function searchPixabay(params: SearchParams): Promise<{ items: MediaItem[]; total: number }> {
  const { query, type = 'all', page = 1, perPage = 15, orientation, color, orderBy } = params;
  const apiKey = getApiKey();

  const items: MediaItem[] = [];
  let total = 0;

  const shouldSearchImages = type === 'all' || type === 'image';
  const shouldSearchVideos = type === 'all' || type === 'video';

  const promises: Promise<void>[] = [];

  if (shouldSearchImages) {
    promises.push(
      axios
        .get(`${BASE_URL}/`, {
          params: {
            key: apiKey,
            q: query,
            page,
            per_page: perPage,
            ...(orientation && { orientation: orientation === 'square' ? 'all' : orientation }),
            ...(color && { colors: color }),
            ...(orderBy && { order: orderBy === 'relevant' ? 'popular' : orderBy }),
          },
        })
        .then((res) => {
          items.push(...res.data.hits.map(mapImage));
          total += res.data.totalHits;
        })
        .catch(() => {})
    );
  }

  if (shouldSearchVideos) {
    promises.push(
      axios
        .get(`${BASE_URL}/videos/`, {
          params: {
            key: apiKey,
            q: query,
            page,
            per_page: perPage,
            ...(orderBy && { order: orderBy === 'relevant' ? 'popular' : orderBy }),
          },
        })
        .then((res) => {
          items.push(...res.data.hits.map(mapVideo));
          total += res.data.totalHits;
        })
        .catch(() => {})
    );
  }

  await Promise.all(promises);
  return { items, total };
}
