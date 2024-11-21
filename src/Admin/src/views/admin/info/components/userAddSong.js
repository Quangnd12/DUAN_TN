import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton,
  IconButton as CloseButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { getSongs } from '../../../../../../services/songs';
import { useAddSongToPlaylistMutation } from '../../../../../../redux/slice/playlistSlice';
import { useGetPlaylistByIdQuery } from '../../../../../../redux/slice/playlistSlice';

const PlaylistSongSelector = ({ playlistId, onClose }) => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingSongs, setAddingSongs] = useState({});
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();
  const { data: playlist } = useGetPlaylistByIdQuery(playlistId);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const response = await getSongs(1, 50); 
        if (response && response.songs && Array.isArray(response.songs)) {
          setSongs(response.songs);
        }
      } catch (err) {
        console.error('Fetch songs error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };


  const handleAddSong = async (song) => {
    try {
      // Mark song as loading
      setAddingSongs(prev => ({...prev, [song.id]: true}));
      
      await addSongToPlaylist({
        playlistId,
        song: {
          songId: song.id,
          name: song.title,
          artist: song.artistName || song.artist,
          image: song.image || '/default-song.jpg'
        }
      }).unwrap();
      
      // Remove the added song from the list
      setSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
    } catch (err) {
      console.error('Failed to add song:', err);
    } finally {
      // Clear loading state for this song
      setAddingSongs(prev => {
        const newState = {...prev};
        delete newState[song.id];
        return newState;
      });
    }
  };

  // Filter out songs already in the playlist
  const availableSongs = songs.filter(
    song => !playlist?.songs?.some(playlistSong => playlistSong.id === song.id)
  );

  return (
    <Box sx={{ p: 3, width: '100%', position: 'relative', boxShadow: "initial", maxHeight: '600px', overflow: 'auto' }}>
      <CloseButton 
        onClick={onClose} 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 1 
        }}
      >
        <CloseIcon />
      </CloseButton>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Add Songs to Playlist
      </Typography>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {availableSongs.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="text.secondary">
                No more songs available to add
              </Typography>
            </Grid>
          ) : (
            availableSongs.map((song) => (
              <Grid item xs={12} key={song.id}>
                <Card 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1,
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 1, 
                      mr: 2 
                    }}
                    image={song.image || '/default-song.jpg'}
                    alt={song.title}
                  />
                  <CardContent sx={{ flex: 1, p: '8px !important' }}>
                    <Typography variant="body1" noWrap>
                      {song.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {song.artist || 'Unknown Artist'}
                    </Typography>
                  </CardContent>
                  <Typography variant="body1" noWrap paddingRight={1}>
                      {formatDuration(song.duration)}
                    </Typography>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleAddSong(song)}
                    disabled={addingSongs[song.id]}
                    sx={{
                      backgroundColor: '#e0f2f1',
                      '&:hover': {
                        backgroundColor: '#b2dfdb'
                      },
                      position: 'relative'
                    }}
                  >
                    {addingSongs[song.id] ? (
                      <CircularProgress 
                        size={24} 
                        sx={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '50%', 
                          marginTop: '-12px', 
                          marginLeft: '-12px' 
                        }} 
                      />
                    ) : (
                      <AddIcon />
                    )}
                  </IconButton>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PlaylistSongSelector;