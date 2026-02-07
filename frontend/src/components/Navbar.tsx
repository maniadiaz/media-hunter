import React from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useThemeMode } from '../context/ThemeContext';

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ favoritesCount, onOpenFavorites }) => {
  const { t, i18n } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('mediahunter-lang', lang);
    setLangAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(20px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(248, 250, 252, 0.8)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <TravelExploreIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          {t('app.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('favorites.title')}>
            <IconButton onClick={onOpenFavorites} sx={{ color: 'text.primary' }}>
              <Badge badgeContent={favoritesCount} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={mode === 'dark' ? t('theme.light') : t('theme.dark')}>
            <IconButton onClick={toggleTheme} sx={{ color: 'text.primary' }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t(`language.${i18n.language}`)}>
            <IconButton onClick={(e) => setLangAnchor(e.currentTarget)} sx={{ color: 'text.primary' }}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
          >
            <MenuItem
              onClick={() => handleLangChange('en')}
              selected={i18n.language === 'en'}
            >
              🇺🇸 English
            </MenuItem>
            <MenuItem
              onClick={() => handleLangChange('es')}
              selected={i18n.language === 'es'}
            >
              🇲🇽 Español
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
