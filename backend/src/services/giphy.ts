import axios from 'axios';
import { MediaItem, SearchParams, DownloadOption } from '../types/media';

const BASE_URL = 'https://api.giphy.com/v1/gifs';

function getApiKey(): string {
  const key = process.env.GIPHY_API_KEY;
  if (!key) throw new Error('GIPHY_API_KEY is not configured');
  return key;
}

interface GiphyGif {
  id: string;
  title: string;
  url: string;
  slug: string;
  username: string;
  user?: { display_name: string; profile_url: string };
  images: {
    original: { url: string; width: string; height: string; size: string; mp4?: string };
    downsized: { url: string; width: string; height: string; size: string };
    downsized_medium: { url: string; width: string; height: string; size: string };
    downsized_small: { url: string; width: string; height: string };
    fixed_height: { url: string; width: string; height: string };
    fixed_height_small: { url: string; width: string; height: string };
    preview_gif: { url: string; width: string; height: string };
    '480w_still': { url: string; width: string; height: string };
  };
}

function mapGif(gif: GiphyGif): MediaItem {
  const downloads: DownloadOption[] = [
    {
      label: 'Original',
      url: gif.images.original.url,
      format: 'gif',
      quality: 'original',
      width: parseInt(gif.images.original.width),
      height: parseInt(gif.images.original.height),
      size: parseInt(gif.images.original.size),
    },
    {
      label: 'Medium',
      url: gif.images.downsized_medium.url,
      format: 'gif',
      quality: 'medium',
      width: parseInt(gif.images.downsized_medium.width),
      height: parseInt(gif.images.downsized_medium.height),
    },
    {
      label: 'Small',
      url: gif.images.downsized_small.url,
      format: 'gif',
      quality: 'small',
    },
  ];

  if (gif.images.original.mp4) {
    downloads.push({
      label: 'MP4',
      url: gif.images.original.mp4,
      format: 'mp4',
      quality: 'original',
    });
  }

  return {
    id: `giphy-${gif.id}`,
    type: 'gif',
    source: 'giphy',
    title: gif.title || `GIF ${gif.id}`,
    thumbnail: gif.images.preview_gif.url || gif.images.fixed_height_small.url,
    preview: gif.images.fixed_height.url,
    author: gif.user?.display_name || gif.username || 'Unknown',
    authorUrl: gif.user?.profile_url,
    sourceUrl: gif.url,
    downloads,
    width: parseInt(gif.images.original.width),
    height: parseInt(gif.images.original.height),
  };
}

export async function searchGiphy(params: SearchParams): Promise<{ items: MediaItem[]; total: number }> {
  const { query, page = 1, perPage = 15 } = params;
  const type = params.type || 'all';

  if (type !== 'all' && type !== 'gif') {
    return { items: [], total: 0 };
  }

  const apiKey = getApiKey();
  const offset = (page - 1) * perPage;

  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      api_key: apiKey,
      q: query,
      limit: perPage,
      offset,
      rating: 'g',
      lang: 'en',
    },
  });

  return {
    items: response.data.data.map(mapGif),
    total: response.data.pagination.total_count,
  };
}
