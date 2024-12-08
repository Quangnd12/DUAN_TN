import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Modal
} from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import { updateArtistSong } from '../../../../redux/slice/artistSongSlice';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { selectGenres, selectAlbums } from '../../../../redux/slice/artistSongSlice';
import { getGenresAndAlbums } from '../../../../redux/slice/artistSongSlice';

const UpdateTrack = ({ open, onClose, onUpdateSuccess, songData }) => {
  const dispatch = useDispatch();
  const genres = useSelector(selectGenres);
  const albums = useSelector(selectAlbums);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(songData?.image || null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [audioDuration, setAudioDuration] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const [currentFileName, setCurrentFileName] = useState(songData?.file_song || '');

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      title: songData?.title || '',
      image: null,
      file_song: null,
      lyrics: songData?.lyrics || '',
      releaseDate: songData?.releaseDate ? new Date(songData.releaseDate).toISOString().split('T')[0] : '',
      is_premium: songData?.is_premium || false,
      duration: songData?.duration || 0,
      genreID: songData?.genres?.map(g => g.id) || [],
      albumID: songData?.albums?.map(a => a.id) || []
    }
  });

  useEffect(() => {
    dispatch(getGenresAndAlbums());
  }, [dispatch]);

  useEffect(() => {
    if (songData) {
      setValue('title', songData.title);
      setValue('lyrics', songData.lyrics);
      setValue('releaseDate', new Date(songData.releaseDate).toISOString().split('T')[0]);
      setValue('is_premium', Boolean(songData.is_premium));
      setValue('genreID', songData.genres?.map(g => g.id) || []);
      setValue('albumID', songData.albums?.map(a => a.id) || []);
      setImagePreview(songData.image);
      setCurrentFileName(songData.file_song);
    }
  }, [songData, setValue]);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSongChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      setSelectedFileName(file.name);
      
      // Lấy duration của file audio mới nếu có
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const durationInSeconds = Math.round(audio.duration);
        setAudioDuration(durationInSeconds);
      };
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (key === 'is_premium') {
          formData.append(key, data[key] ? 1 : 0);
        } else if (key === 'genreID' && data[key]) {
          data[key].forEach(id => {
            formData.append('genreID[]', id);
          });
        } else if (key === 'albumID' && data[key]) {
          data[key].forEach(id => {
            formData.append('albumID[]', id);
          });
        } else if (data[key] !== null) {
          if (key === 'duration' && audioDuration) {
            formData.append(key, audioDuration);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      await dispatch(updateArtistSong({ id: songData.id, formData })).unwrap();
      
      setNotification({
        open: true,
        message: 'Update song successfully!',
        type: 'success'
      });

      onUpdateSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Update error:', error);
      setNotification({
        open: true,
        message: 'An error occurred while updating the song!',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="update-track-modal"
      aria-describedby="update-track-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box sx={{ 
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflowY: 'auto',
        p: 4, 
        color: 'white', 
        position: 'relative',
        background: 'linear-gradient(to bottom right, rgba(26,26,46,0.95), rgba(22,33,62,0.95))',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        '&:focus': {
          outline: 'none'
        },
        '& .MuiInputBase-root': {
          color: 'white',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3B82F6',
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#3B82F6',
        },
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': { 
              color: '#ef4444',
              transform: 'rotate(90deg)',
              background: 'rgba(239,68,68,0.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #9333EA, #3B82F6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '15px'
        }}>
          Update Track
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Left Column - Basic Information */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Basic Information
              </Typography>

              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="releaseDate"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    type="date" 
                    label="Release Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <FormControlLabel
                control={
                  <Controller
                    name="is_premium"
                    control={control}
                    render={({ field }) => (
                      <Switch 
                        {...field} 
                        checked={field.value}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#3B82F6',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#3B82F6',
                          },
                        }}
                      />
                    )}
                  />
                }
                label="Premium Track"
              />

              <Controller
                name="genreID"
                control={control}
                rules={{ required: 'Please select at least one genre' }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Genres</InputLabel>
                    <Select 
                      {...field} 
                      multiple
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip 
                              key={value}
                              label={genres.find(g => g.id === value)?.name}
                              sx={{ 
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                color: 'white'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="albumID"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Albums</InputLabel>
                    <Select 
                      {...field} 
                      multiple
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip 
                              key={value}
                              label={albums.find(a => a.id === value)?.title}
                              sx={{ 
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                color: 'white'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {albums.map((album) => (
                        <MenuItem key={album.id} value={album.id}>
                          {album.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Right Column - Media and Lyrics */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Media and Lyrics
              </Typography>

              {/* Image Upload with improved visibility */}
              <Box sx={{ width: '100%' }}>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <>
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, onChange)}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Box sx={{
                          border: '2px dashed rgba(59, 130, 246, 0.5)',
                          borderRadius: '16px',
                          p: 2,
                          height: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          '&:hover': {
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}>
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px'
                              }}
                            />
                          ) : (
                            <>
                              <ImageIcon sx={{ fontSize: 40, mb: 1, color: '#3B82F6' }} />
                              <Typography>Upload Cover Image</Typography>
                            </>
                          )}
                        </Box>
                      </label>
                    </>
                  )}
                />
              </Box>

              {/* Song Upload with improved visibility */}
              <Box sx={{ width: '100%' }}>
                <Controller
                  name="file_song"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <>
                      <input
                        type="file"
                        onChange={(e) => handleSongChange(e, onChange)}
                        accept="audio/*"
                        style={{ display: 'none' }}
                        id="song-upload"
                      />
                      <label htmlFor="song-upload">
                        <Box sx={{
                          border: '2px dashed rgba(59, 130, 246, 0.5)',
                          borderRadius: '16px',
                          p: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          '&:hover': {
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}>
                          <CloudUploadIcon sx={{ fontSize: 30, color: '#3B82F6' }} />
                          <Box>
                            <Typography variant="subtitle1">
                              {selectedFileName || currentFileName || 'Choose audio file'}
                            </Typography>
                            {audioDuration && (
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Duration: {Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, '0')}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </label>
                    </>
                  )}
                />
              </Box>

              {/* Lyrics */}
              <Controller
                name="lyrics"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Lyrics"
                    multiline
                    rows={6}
                    fullWidth
                  />
                )}
              />
            </Box>
          </Box>

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 200,
                height: 48,
                background: 'linear-gradient(to right, #9333EA, #3B82F6)',
                '&:hover': {
                  background: 'linear-gradient(to right, #8B31E3, #3575E3)',
                }
              }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </Box>
        </form>

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default UpdateTrack;