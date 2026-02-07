import { SearchParams, SearchResponse, MediaItem, MediaSource } from '../types/media';
import { searchPexels } from './pexels';
import { searchPixabay } from './pixabay';
import { searchGiphy } from './giphy';
import { searchFreesound } from './freesound';
import { getEmbedding, cosineSimilarity } from './embeddingService';

interface SourceResult {
  source: MediaSource;
  items: MediaItem[];
  total: number;
  error?: string;
}

export async function searchAll(params: SearchParams): Promise<SearchResponse> {
  const sources: { source: MediaSource; fn: (p: SearchParams) => Promise<{ items: MediaItem[]; total: number }> }[] = [
    { source: 'pexels', fn: searchPexels },
    { source: 'pixabay', fn: searchPixabay },
    { source: 'giphy', fn: searchGiphy },
    { source: 'freesound', fn: searchFreesound },
  ];

  const results = await Promise.allSettled(
    sources.map(async ({ source, fn }): Promise<SourceResult> => {
      try {
        const result = await fn(params);
        return { source, items: result.items, total: result.total };
      } catch (err: any) {
        console.error(`[${source}] Search error:`, err.message);
        return { source, items: [], total: 0, error: err.message };
      }
    })
  );

  const allItems: MediaItem[] = [];
  const sourceSummary: SearchResponse['sources'] = [];
  let totalResults = 0;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { source, items, total, error } = result.value;
      allItems.push(...items);
      totalResults += total;
      sourceSummary.push({ source, count: items.length, error });
    }
  }

  // Interleave results from different sources for variety
  const interleaved = interleaveResults(allItems);

  // Semantic re-ranking if query exists
  const rankedItems = params.query 
    ? await semanticRerank(params.query, interleaved)
    : interleaved;

  return {
    items: rankedItems,
    totalResults,
    page: params.page || 1,
    perPage: params.perPage || 15,
    sources: sourceSummary,
  };
}

async function semanticRerank(query: string, items: MediaItem[]): Promise<MediaItem[]> {
  try {
    const queryEmbedding = await getEmbedding(query);
    
    const itemsWithScores = await Promise.all(
      items.map(async (item) => {
        const text = `${item.title} ${item.description || ''} ${item.tags?.join(' ') || ''}`.trim();
        const itemEmbedding = await getEmbedding(text);
        const similarity = cosineSimilarity(queryEmbedding, itemEmbedding);
        return { item, similarity };
      })
    );

    return itemsWithScores
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ item }) => item);
  } catch (error) {
    console.error('Semantic rerank error:', error);
    return items;
  }
}

function interleaveResults(items: MediaItem[]): MediaItem[] {
  const bySource: Record<string, MediaItem[]> = {};

  for (const item of items) {
    if (!bySource[item.source]) bySource[item.source] = [];
    bySource[item.source].push(item);
  }

  const sources = Object.keys(bySource);
  const result: MediaItem[] = [];
  let index = 0;
  let added = true;

  while (added) {
    added = false;
    for (const source of sources) {
      if (index < bySource[source].length) {
        result.push(bySource[source][index]);
        added = true;
      }
    }
    index++;
  }

  return result;
}
