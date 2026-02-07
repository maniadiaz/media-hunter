import { useState, useCallback } from 'react';
import { SearchParams, SearchResponse } from '../types/media';
import { searchMedia } from '../services/api';

const HISTORY_KEY = 'mediahunter-history';
const MAX_HISTORY = 20;

function loadHistory(): string[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function useSearch() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(loadHistory);

  const search = useCallback(async (params: SearchParams) => {
    if (!params.query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchMedia(params);
      setResults(data);

      setSearchHistory((prev) => {
        const filtered = prev.filter((q) => q !== params.query);
        const next = [params.query, ...filtered].slice(0, MAX_HISTORY);
        saveHistory(next);
        return next;
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Search failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    saveHistory([]);
  }, []);

  return { results, loading, error, search, searchHistory, clearHistory };
}
