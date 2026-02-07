import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import GifIcon from '@mui/icons-material/Gif';
import AppsIcon from '@mui/icons-material/Apps';
import { MediaType } from '../types/media';

interface FilterBarProps {
  activeType: MediaType | 'all';
  onTypeChange: (type: MediaType | 'all') => void;
  orientation?: string;
  onOrientationChange: (orientation: string) => void;
  orderBy?: string;
  onOrderByChange: (orderBy: string) => void;
}

const typeFilters: { key: MediaType | 'all'; icon: React.ReactElement; labelKey: string }[] = [
  { key: 'all', icon: <AppsIcon fontSize="small" />, labelKey: 'filters.all' },
  { key: 'image', icon: <ImageIcon fontSize="small" />, labelKey: 'filters.images' },
  { key: 'video', icon: <VideocamIcon fontSize="small" />, labelKey: 'filters.videos' },
  { key: 'audio', icon: <AudiotrackIcon fontSize="small" />, labelKey: 'filters.audio' },
  { key: 'gif', icon: <GifIcon fontSize="small" />, labelKey: 'filters.gifs' },
];

const FilterBar: React.FC<FilterBarProps> = ({
  activeType,
  onTypeChange,
  orientation,
  onOrientationChange,
  orderBy,
  onOrderByChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        my: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {typeFilters.map(({ key, icon, labelKey }) => (
          <Chip
            key={key}
            icon={icon}
            label={t(labelKey)}
            onClick={() => onTypeChange(key)}
            color={activeType === key ? 'primary' : 'default'}
            variant={activeType === key ? 'filled' : 'outlined'}
            sx={{ fontWeight: activeType === key ? 600 : 400 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, ml: { xs: 0, sm: 2 } }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t('filters.orientation')}</InputLabel>
          <Select
            value={orientation || ''}
            label={t('filters.orientation')}
            onChange={(e) => onOrientationChange(e.target.value)}
          >
            <MenuItem value="">-</MenuItem>
            <MenuItem value="landscape">{t('filters.landscape')}</MenuItem>
            <MenuItem value="portrait">{t('filters.portrait')}</MenuItem>
            <MenuItem value="square">{t('filters.square')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t('filters.sortBy')}</InputLabel>
          <Select
            value={orderBy || 'relevant'}
            label={t('filters.sortBy')}
            onChange={(e) => onOrderByChange(e.target.value)}
          >
            <MenuItem value="relevant">{t('filters.relevant')}</MenuItem>
            <MenuItem value="popular">{t('filters.popular')}</MenuItem>
            <MenuItem value="latest">{t('filters.latest')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default FilterBar;
