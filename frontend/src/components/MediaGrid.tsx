import React from 'react';
import Grid from '@mui/material/Grid';
import { MediaItem } from '../types/media';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (item: MediaItem) => void;
  onPreview: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, isFavorite, onToggleFavorite, onPreview, onDownload }) => {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <MediaCard
            item={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => onToggleFavorite(item)}
            onPreview={() => onPreview(item)}
            onDownload={() => onDownload(item)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaGrid;
