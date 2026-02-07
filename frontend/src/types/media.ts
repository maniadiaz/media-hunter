export type MediaType = 'image' | 'video' | 'audio' | 'gif';

export type MediaSource = 'pexels' | 'pixabay' | 'giphy' | 'freesound';

export interface MediaItem {
  id: string;
  type: MediaType;
  source: MediaSource;
  title: string;
  description?: string;
  thumbnail: string;
  preview: string;
  author: string;
  authorUrl?: string;
  sourceUrl: string;
  downloads: DownloadOption[];
  duration?: number;
  width?: number;
  height?: number;
  tags?: string[];
}

export interface DownloadOption {
  label: string;
  url: string;
  format: string;
  quality?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface SearchParams {
  query: string;
  type?: MediaType | 'all';
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  color?: string;
  orderBy?: 'relevant' | 'popular' | 'latest';
}

export interface SearchResponse {
  items: MediaItem[];
  totalResults: number;
  page: number;
  perPage: number;
  sources: {
    source: MediaSource;
    count: number;
    error?: string;
  }[];
}
