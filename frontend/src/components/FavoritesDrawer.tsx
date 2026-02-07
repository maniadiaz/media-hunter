import React from 'react';
import { useTranslation } from 'react-i18next';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import GifIcon from '@mui/icons-material/Gif';
import { MediaItem, MediaType } from '../types/media';

interface FavoritesDrawerProps {
  open: boolean;
  onClose: () => void;
  favorites: MediaItem[];
  onRemove: (item: MediaItem) => void;
  onPreview: (item: MediaItem) => void;
}

const typeIcon: Record<MediaType, React.ReactElement> = {
  image: <ImageIcon />,
  video: <VideocamIcon />,
  audio: <AudiotrackIcon />,
  gif: <GifIcon />,
};

const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ open, onClose, favorites, onRemove, onPreview }) => {
  const { t } = useTranslation();

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {t('favorites.title')} ({favorites.length})
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {favorites.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <Typography color="text.secondary">{t('favorites.empty')}</Typography>
        </Box>
      ) : (
        <List>
          {favorites.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => onRemove(item)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => { onPreview(item); onClose(); }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src={item.type !== 'audio' ? item.thumbnail : undefined}
                  sx={{ width: 56, height: 56, mr: 1 }}
                >
                  {typeIcon[item.type]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {item.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Chip label={item.type} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                    <Chip label={item.source} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
};

export default FavoritesDrawer;
