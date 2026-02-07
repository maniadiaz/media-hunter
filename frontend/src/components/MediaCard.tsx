import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { MediaItem } from '../types/media';

interface MediaCardProps {
  item: MediaItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPreview: () => void;
  onDownload: () => void;
}

const sourceColors: Record<string, string> = {
  pexels: '#05A081',
  pixabay: '#00AB6B',
  giphy: '#FF6666',
  freesound: '#F0712C',
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, isFavorite, onToggleFavorite, onPreview, onDownload }) => {
  const { t } = useTranslation();

  const isPlayable = item.type === 'video' || item.type === 'audio';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative' }} onClick={onPreview}>
        {item.type === 'audio' ? (
          <Box
            sx={{
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <AudiotrackIcon sx={{ fontSize: 64, color: 'white', opacity: 0.8 }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            height="180"
            image={item.thumbnail || item.preview}
            alt={item.title}
            sx={{ objectFit: 'cover' }}
            loading="lazy"
          />
        )}

        {isPlayable && item.type !== 'audio' && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.85,
            }}
          >
            <PlayCircleOutlineIcon sx={{ fontSize: 48, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
          </Box>
        )}

        {item.duration && (
          <Chip
            label={formatDuration(item.duration)}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
        )}

        <Chip
          label={t(`source.${item.source}`)}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: sourceColors[item.source] || '#666',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 600,
            height: 22,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 0.5, pt: 1.5, px: 1.5 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('media.by')} {item.author}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 1 }}>
        <Tooltip title={isFavorite ? t('favorites.remove') : t('favorites.add')}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            color={isFavorite ? 'secondary' : 'default'}
          >
            {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={t('media.preview')}>
          <IconButton size="small" onClick={onPreview}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={t('media.download')}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default MediaCard;
