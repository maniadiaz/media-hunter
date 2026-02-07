import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import ClearIcon from '@mui/icons-material/Clear';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchHistory: string[];
  onClearHistory: () => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchHistory, onClearHistory, loading }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const anchorRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    onSearch(q);
    setShowHistory(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowHistory(false)}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 700, mx: 'auto' }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          ref={anchorRef}
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            borderRadius: 3,
            border: 2,
            borderColor: 'primary.main',
            transition: 'box-shadow 0.2s',
            '&:focus-within': {
              boxShadow: (theme) =>
                `0 0 0 3px ${theme.palette.primary.main}40`,
            },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            sx={{ flex: 1, fontSize: '1.1rem' }}
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
            disabled={loading}
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            type="submit"
            color="primary"
            disabled={!query.trim() || loading}
            sx={{
              ml: 1,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <Popper
          open={showHistory && searchHistory.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1300, width: anchorRef.current?.clientWidth || 700 }}
        >
          <Paper elevation={4} sx={{ mt: 1, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('history.title')}
              </Typography>
              <Button size="small" onClick={onClearHistory} sx={{ fontSize: '0.7rem' }}>
                {t('history.clear')}
              </Button>
            </Box>
            <List dense>
              {searchHistory.slice(0, 8).map((q) => (
                <ListItemButton key={q} onClick={() => handleHistoryClick(q)}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HistoryIcon fontSize="small" color="disabled" />
                  </ListItemIcon>
                  <ListItemText primary={q} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
