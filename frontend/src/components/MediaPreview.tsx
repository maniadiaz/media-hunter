import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MediaItem, DownloadOption } from '../types/media';
import { getDownloadUrl } from '../services/api';

interface MediaPreviewProps {
  item: MediaItem | null;
  open: boolean;
  onClose: () => void;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ item, open, onClose }) => {
  const { t } = useTranslation();
  const [snackOpen, setSnackOpen] = useState(false);

  if (!item) return null;

  const handleDownload = (opt: DownloadOption) => {
    const filename = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.${opt.format}`;
    const url = getDownloadUrl(opt.url, filename);
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(item.sourceUrl);
    setSnackOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }} noWrap>
            {item.title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Preview area */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {item.type === 'video' && (
                <video
                  controls
                  autoPlay
                  style={{ width: '100%', borderRadius: 8, maxHeight: 400, background: '#000' }}
                  src={item.preview}
                />
              )}

              {item.type === 'audio' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    p: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt="waveform"
                      style={{ width: '100%', borderRadius: 8, opacity: 0.9 }}
                    />
                  )}
                  <audio controls autoPlay style={{ width: '100%' }} src={item.preview} />
                </Box>
              )}

              {(item.type === 'image' || item.type === 'gif') && (
                <img
                  src={item.preview}
                  alt={item.title}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    maxHeight: 500,
                    objectFit: 'contain',
                    background: '#111',
                  }}
                />
              )}
            </Box>

            {/* Info & downloads */}
            <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('media.by')} <strong>{item.author}</strong>
              </Typography>

              {item.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
              )}

              {item.tags && item.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {item.tags.slice(0, 8).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={item.sourceUrl}
                  target="_blank"
                >
                  {t('media.openSource')}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyLink}
                >
                  {t('media.copyLink')}
                </Button>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" gutterBottom>
                {t('media.downloadOptions')}
              </Typography>

              <List dense disablePadding>
                {item.downloads.map((opt, idx) => (
                  <ListItemButton key={idx} onClick={() => handleDownload(opt)} sx={{ borderRadius: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DownloadIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={opt.label}
                      secondary={[
                        opt.format.toUpperCase(),
                        opt.width && opt.height ? `${opt.width}x${opt.height}` : '',
                        formatFileSize(opt.size),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message={t('media.linkCopied')}
      />
    </>
  );
};

export default MediaPreview;
