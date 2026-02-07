import axios from 'axios';
import { SearchParams, SearchResponse } from '../types/media';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export async function searchMedia(params: SearchParams): Promise<SearchResponse> {
  const response = await apiClient.get<SearchResponse>('/search', { params });
  return response.data;
}

export function getDownloadUrl(url: string, filename: string): string {
  return `${API_BASE}/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
}

export async function downloadFile(url: string, filename: string): Promise<void> {
  const downloadUrl = getDownloadUrl(url, filename);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
