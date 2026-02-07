import { Router, Request, Response } from 'express';
import { searchAll } from '../services/searchAggregator';
import { SearchParams, MediaType } from '../types/media';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { query, type, page, perPage, orientation, color, orderBy } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const validTypes = ['all', 'image', 'video', 'audio', 'gif'];
    const mediaType = typeof type === 'string' && validTypes.includes(type) ? type as MediaType | 'all' : 'all';

    const params: SearchParams = {
      query: query.trim(),
      type: mediaType,
      page: page ? parseInt(page as string, 10) : 1,
      perPage: perPage ? Math.min(parseInt(perPage as string, 10), 50) : 20,
      orientation: orientation as SearchParams['orientation'],
      color: color as string,
      orderBy: orderBy as SearchParams['orderBy'],
    };

    const results = await searchAll(params);
    res.json(results);
  } catch (error: any) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
