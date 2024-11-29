import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMix } from '../../../../services/mixService';
import {
  Typography, TextField, Button, Container, Box, IconButton, Alert,
  CircularProgress, Stack, Select, MenuItem, Slider
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  VolumeUp as VolumeUpIcon,
  MusicNote as MusicNoteIcon,
  GraphicEq as GraphicEqIcon,
  Timer as TimerIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import SongSearchDialog from './SongSearchDialog';

const SongCard = ({ song, settings, onSettingChange, onRemove, onReorder, isFirst, isLast }) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        p: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
              }}
            >
              <MusicNoteIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'white' }}>{song.title}</Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <IconButton 
              size="small"
              onClick={() => onReorder('up')}
              disabled={isFirst}
              sx={{
                color: 'white',
                '&:disabled': { color: 'rgba(255,255,255,0.3)' }
              }}
            >
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onReorder('down')}
              disabled={isLast}
              sx={{
                color: 'white',
                '&:disabled': { color: 'rgba(255,255,255,0.3)' }
              }}
            >
              <ArrowDownwardIcon />
            </IconButton>
            <IconButton
              onClick={onRemove}
              sx={{
                color: '#ff4081',
                '&:hover': { backgroundColor: 'rgba(255,64,129,0.1)' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>

        <Stack spacing={3}>
          {[
            { icon: <VolumeUpIcon />, label: 'Volume', setting: 'volume', min: 0, max: 2, step: 0.1, format: v => `${(v * 100).toFixed(0)}%` },
            { icon: <GraphicEqIcon />, label: 'Bass Boost', setting: 'bassBoost', min: -6, max: 6, step: 1, format: v => `${v}dB` },
            { icon: <GraphicEqIcon />, label: 'Treble Boost', setting: 'trebleBoost', min: -6, max: 6, step: 1, format: v => `${v}dB` },
            { icon: <TimerIcon />, label: 'Delay', setting: 'delay', min: 0, max: 2000, step: 50, format: v => `${v}ms` }
          ].map(({ icon, label, setting, min, max, step, format }) => (
            <Box key={setting}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {React.cloneElement(icon, { sx: { mr: 1, color: 'white' } })}
                <Typography variant="subtitle2" sx={{ color: 'white' }}>{label}</Typography>
              </Box>
              <Slider
                value={settings[setting] || 0}
                min={min}
                max={max}
                step={step}
                onChange={(_, value) => onSettingChange(setting, value)}
                valueLabelDisplay="auto"
                valueLabelFormat={format}
                sx={{
                  color: '#ff4081',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(255,64,129,0.16)'
                    }
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                  }
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

const CreateMix = () => {
  const navigate = useNavigate();
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [mixSettings, setMixSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [songSearchOpen, setSongSearchOpen] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState('smooth');

  // Transition style options matching backend
  const transitionStyles = [
    { value: 'smooth', label: 'Smooth Transition' },
    { value: 'dynamic', label: 'Dynamic Transition' },
    { value: 'contrast', label: 'Contrast Transition' }
  ];

  const handleSettingChange = (songId, setting, value) => {
    setMixSettings(prev => ({
      ...prev,
      [songId]: {
        ...prev[songId],
        [setting]: value
      }
    }));
  };

  const handleSongReorder = (songId, direction) => {
    setSelectedSongs(prev => {
      const songs = [...prev];
      const currentIndex = songs.findIndex(s => s.id === songId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < songs.length) {
        const temp = songs[currentIndex];
        songs[currentIndex] = songs[newIndex];
        songs[newIndex] = temp;
      }

      return songs.map((song, idx) => ({
        ...song,
        sequence: idx
      }));
    });
  };

  const handleAddSong = (song) => {
    setSelectedSongs(prev => {
      const exists = prev.find(s => s.id === song.id);
      if (exists) return prev;

      const newSong = {
        ...song,
        sequence: prev.length
      };

      setMixSettings(prevSettings => ({
        ...prevSettings,
        [song.id]: {
          volume: 1.0,
          bassBoost: 0,
          trebleBoost: 0,
          delay: 0
        }
      }));

      return [...prev, newSong];
    });
  };

  const handleRemoveSong = (songId) => {
    setSelectedSongs(prev => prev.filter(song => song.id !== songId));
    setMixSettings(prev => {
      const newSettings = { ...prev };
      delete newSettings[songId];
      return newSettings;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSongs.length === 0) {
      setError('Please add at least two songs to the mix');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const mixData = {
        songIds: selectedSongs.map(song => song.id),
        mixSettings: selectedSongs.reduce((acc, song, index) => {
          acc[index] = mixSettings[song.id] || {
            volume: 1.0,
            bassBoost: 0,
            trebleBoost: 0,
            delay: 0
          };
          return acc;
        }, {}),
        transitionStyle
      };

      await createMix(mixData);
      navigate('/mixes');
    } catch (err) {
      setError('Failed to create mix: ' + err.message);
      console.error('Error creating mix:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4
            }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Create Your Mix
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/mixes')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving || selectedSongs.length < 2}
                  sx={{
                    background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff4081 60%, #7c4dff 90%)',
                    }
                  }}
                >
                  {saving ? 'Creating...' : 'Create Mix'}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ 
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              p: 3
            }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Transition Style
              </Typography>
              <Select
                value={transitionStyle}
                onChange={(e) => setTransitionStyle(e.target.value)}
                fullWidth
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff4081'
                  }
                }}
              >
                <MenuItem value="smooth">Smooth Transition</MenuItem>
                <MenuItem value="dynamic">Dynamic Transition</MenuItem>
                <MenuItem value="contrast">Contrast Transition</MenuItem>
              </Select>
            </Box>

            {error && (
              <Alert 
                severity="error"
                sx={{ 
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255,82,82,0.1)',
                  color: '#ff5252'
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={() => setSongSearchOpen(true)}
              startIcon={<AddIcon />}
              sx={{
                background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                borderRadius: '16px',
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff4081 60%, #7c4dff 90%)',
                }
              }}
            >
              Add Songs to Mix
            </Button>

            <Stack spacing={3}>
              {selectedSongs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  settings={mixSettings[song.id] || {}}
                  onSettingChange={(setting, value) => handleSettingChange(song.id, setting, value)}
                  onRemove={() => handleRemoveSong(song.id)}
                  onReorder={(direction) => handleSongReorder(song.id, direction)}
                  isFirst={index === 0}
                  isLast={index === selectedSongs.length - 1}
                />
              ))}
            </Stack>
          </Stack>
        </form>

        <SongSearchDialog
          open={songSearchOpen}
          onClose={() => setSongSearchOpen(false)}
          onSongSelect={handleAddSong}
          excludeSongIds={selectedSongs.map(song => song.id)}
        />
      </Container>
    </Box>
  );
};

export default CreateMix;