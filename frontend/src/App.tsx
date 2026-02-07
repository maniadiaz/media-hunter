import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import MediaGrid from './components/MediaGrid';
import MediaPreview from './components/MediaPreview';
import FavoritesDrawer from './components/FavoritesDrawer';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';
import { MediaItem, MediaType, SearchParams } from './types/media';
import { downloadFile } from './services/api';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { results, loading, error, search, searchHistory, clearHistory } = useSearch();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const [activeType, setActiveType] = useState<MediaType | 'all'>('all');
  const [orientation, setOrientation] = useState('');
  const [orderBy, setOrderBy] = useState('relevant');
  const [currentQuery, setCurrentQuery] = useState('');
  const [page, setPage] = useState(1);

  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const handleSearch = (query: string, p = 1) => {
    setCurrentQuery(query);
    setPage(p);
    const params: SearchParams = {
      query,
      type: activeType,
      page: p,
      perPage: 20,
      ...(orientation && { orientation: orientation as SearchParams['orientation'] }),
      ...(orderBy && { orderBy: orderBy as SearchParams['orderBy'] }),
    };
    search(params);
  };

  const handleTypeChange = (type: MediaType | 'all') => {
    setActiveType(type);
    if (currentQuery) {
      setPage(1);
      const params: SearchParams = {
        query: currentQuery,
        type,
        page: 1,
        perPage: 20,
        ...(orientation && { orientation: orientation as SearchParams['orientation'] }),
        ...(orderBy && { orderBy: orderBy as SearchParams['orderBy'] }),
      };
      search(params);
    }
  };

  const handleOrientationChange = (val: string) => {
    setOrientation(val);
    if (currentQuery) handleSearch(currentQuery);
  };

  const handleOrderByChange = (val: string) => {
    setOrderBy(val);
    if (currentQuery) handleSearch(currentQuery);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, p: number) => {
    handleSearch(currentQuery, p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreview = (item: MediaItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleDownload = (item: MediaItem) => {
    if (item.downloads.length > 0) {
      const best = item.downloads[0];
      const filename = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.${best.format}`;
      downloadFile(best.url, filename);
    }
  };

  const totalPages = results ? Math.ceil(results.totalResults / (results.perPage || 20)) : 0;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Hero section when no results */}
        {!results && !loading && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <TravelExploreIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.8 }} />
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                mb: 1,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('app.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {t('app.subtitle')}
            </Typography>
          </Box>
        )}

        {/* Search bar */}
        <Box sx={{ mb: 3, mt: results ? 0 : -2 }}>
          <SearchBar
            onSearch={handleSearch}
            searchHistory={searchHistory}
            onClearHistory={clearHistory}
            loading={loading}
          />
        </Box>

        {/* Filters */}
        <FilterBar
          activeType={activeType}
          onTypeChange={handleTypeChange}
          orientation={orientation}
          onOrientationChange={handleOrientationChange}
          orderBy={orderBy}
          onOrderByChange={handleOrderByChange}
        />

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {t('search.error')}: {error}
          </Alert>
        )}

        {/* Results */}
        {results && !loading && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('search.results', { count: results.totalResults || 0 })}
              {results.sources && results.sources.length > 0 && (
                <>
                  {' · '}
                  {results.sources
                    .filter((s) => s.count > 0)
                    .map((s) => `${s.source}: ${s.count}`)
                    .join(' · ')}
                </>
              )}
            </Typography>

            {results.items && results.items.length > 0 ? (
              <MediaGrid
                items={results.items}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  {t('search.noResults')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('search.noResultsHint')}
                </Typography>
              </Box>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.min(totalPages, 50)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('footer.powered')}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          {t('footer.attribution')}
        </Typography>
      </Box>

      {/* Preview modal */}
      <MediaPreview
        item={previewItem}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      {/* Favorites drawer */}
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onRemove={toggleFavorite}
        onPreview={handlePreview}
      />
    </Box>
  );
};

export default App;
