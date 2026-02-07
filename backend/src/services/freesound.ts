import axios from 'axios';
import { MediaItem, SearchParams, DownloadOption } from '../types/media';

const BASE_URL = 'https://freesound.org/apiv2';

function getApiKey(): string {
  const key = process.env.FREESOUND_API_KEY;
  if (!key) throw new Error('FREESOUND_API_KEY is not configured');
  return key;
}

interface FreesoundResult {
  id: number;
  name: string;
  description: string;
  tags: string[];
  duration: number;
  username: string;
  url: string;
  previews: {
    'preview-hq-mp3': string;
    'preview-hq-ogg': string;
    'preview-lq-mp3': string;
    'preview-lq-ogg': string;
  };
  images: {
    waveform_m: string;
    waveform_l: string;
    spectral_m: string;
    spectral_l: string;
  };
  download: string;
  filesize: number;
  type: string;
  samplerate: number;
  channels: number;
}

function mapSound(sound: FreesoundResult): MediaItem {
  const downloads: DownloadOption[] = [
    {
      label: 'HQ MP3',
      url: sound.previews['preview-hq-mp3'],
      format: 'mp3',
      quality: 'high',
    },
    {
      label: 'HQ OGG',
      url: sound.previews['preview-hq-ogg'],
      format: 'ogg',
      quality: 'high',
    },
    {
      label: 'LQ MP3',
      url: sound.previews['preview-lq-mp3'],
      format: 'mp3',
      quality: 'low',
    },
  ];

  return {
    id: `freesound-${sound.id}`,
    type: 'audio',
    source: 'freesound',
    title: sound.name,
    description: sound.description?.substring(0, 200),
    thumbnail: sound.images?.waveform_m || '',
    preview: sound.previews['preview-hq-mp3'],
    author: sound.username,
    sourceUrl: sound.url,
    downloads,
    duration: Math.round(sound.duration),
    tags: sound.tags,
  };
}

export async function searchFreesound(params: SearchParams): Promise<{ items: MediaItem[]; total: number }> {
  const { query, page = 1, perPage = 15, orderBy } = params;
  const type = params.type || 'all';

  if (type !== 'all' && type !== 'audio') {
    return { items: [], total: 0 };
  }

  const apiKey = getApiKey();

  let sort = 'score';
  if (orderBy === 'popular') sort = 'downloads_desc';
  if (orderBy === 'latest') sort = 'created_desc';

  const response = await axios.get(`${BASE_URL}/search/text/`, {
    params: {
      token: apiKey,
      query,
      page,
      page_size: perPage,
      sort,
      fields: 'id,name,description,tags,duration,username,url,previews,images,download,filesize,type,samplerate,channels',
    },
  });

  return {
    items: response.data.results.map(mapSound),
    total: response.data.count,
  };
}
