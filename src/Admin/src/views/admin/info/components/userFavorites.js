import React, { useState } from "react";
import {
  useGetUserFavoritesQuery,
  useToggleFavoriteMutation,
} from "../../../../../../redux/slice/favoriets";
import { useTheme } from "../../ThemeContext";
import { translations } from "../../../../components/Translation/translation";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Skeleton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  PlayArrow as PlayArrowIcon,
  MusicNote as MusicNoteIcon,
} from "@mui/icons-material";

const UserFavorites = () => {
  const { language } = useTheme();
  const t = translations[language];
  const [selectedSong, setSelectedSong] = useState(null);

  const {
    data: favoritesResponse,
    isLoading,
    error,
  } = useGetUserFavoritesQuery();
  const [toggleFavorite, { isLoading: isToggling }] =
    useToggleFavoriteMutation();

  const favorites = favoritesResponse?.favorites || [];


  const handleToggleFavorite = async (songId) => {
    try {
      await toggleFavorite(songId).unwrap();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <Box className="p-4">
        {[...Array(4)].map((_, index) => (
          <Paper key={index} className="mb-4 p-4">
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Skeleton variant="rectangular" width={60} height={60} />
              </Grid>
              <Grid item xs>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        {t.common.errorOccurred}
      </Alert>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h5" className="mb-6 font-bold">
        {t.userProfile.myFavorites}
      </Typography>

      <Grid container spacing={2}>
        {favorites.map((song) => (
          <Grid item xs={12} sm={6} md={4} key={song.id}>
            <Paper
              elevation={selectedSong === song.id ? 6 : 2}
              className={`p-3 transition-all duration-300 hover:shadow-lg ${
                selectedSong === song.id ? 'bg-gray-50' : ''
              }`}
              onMouseEnter={() => setSelectedSong(song.id)}
              onMouseLeave={() => setSelectedSong(null)}
            >
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Box
                    className="w-12 h-12 rounded-lg overflow-hidden relative group"
                    style={{ backgroundColor: '#f0f0f0' }}
                  >
                    {song.image ? (
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MusicNoteIcon className="w-full h-full p-2 text-gray-400" />
                    )}
                    <Box className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconButton 
                        size="small" 
                        className="text-white"
                        onClick={() => {
                          console.log('Play song:', song.file_song);
                        }}
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs>
                  <Typography 
                    variant="body1" 
                    className="font-semibold line-clamp-1"
                    style={{ fontSize: '0.9rem' }}
                  >
                    {song.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    className="line-clamp-1"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {song.artist}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="textSecondary" 
                    display="block"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {song.genre} • {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </Typography>
                </Grid>

                <Grid item>
                  <IconButton
                    color="primary"
                    disabled={isToggling}
                    onClick={() => handleToggleFavorite(song.id)}
                    size="small"
                  >
                    {isToggling ? (
                      <CircularProgress size={20} />
                    ) : (
                      <FavoriteIcon fontSize="small" className="text-red-500" />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}

        {favorites.length === 0 && (
          <Grid item xs={12}>
            <Box className="text-center py-6">
              <MusicNoteIcon className="text-gray-300 text-5xl mb-3" />
              <Typography variant="body1" color="textSecondary">
                {t.userProfile.noFavorites}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserFavorites;
