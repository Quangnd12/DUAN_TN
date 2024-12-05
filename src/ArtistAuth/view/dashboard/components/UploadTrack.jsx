import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Modal
} from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadSong, getGenresAndAlbums, selectGenres, selectAlbums } from '../../../../redux/slice/artistSongSlice';

const UploadTrack = ({ open, onClose, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const genres = useSelector(selectGenres);
  const albums = useSelector(selectAlbums);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [audioDuration, setAudioDuration] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      image: null,
      file_song: null,
      lyrics: '',
      releaseDate: '',
      is_premium: false,
      albumID: [],
      genreID: [],
      duration: 0
    }
  });

  useEffect(() => {
    dispatch(getGenresAndAlbums());
  }, [dispatch]);

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
      if (!data.genreID || data.genreID.length === 0) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn ít nhất một thể loại',
          type: 'error'
        });
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append('title', data.title || '');
      formData.append('duration', audioDuration || 0);
      formData.append('releaseDate', data.releaseDate || new Date().toISOString().split('T')[0]);
      formData.append('is_premium', data.is_premium ? 1 : 0);
      formData.append('is_explicit', 0);
      formData.append('listens', 0);
      
      if (data.lyrics) {
        formData.append('lyrics', data.lyrics);
      }

      if (data.albumID && data.albumID.length > 0) {
        data.albumID.forEach(id => {
          formData.append('albumID[]', id);
        });
      }

      data.genreID.forEach(id => {
        formData.append('genreID[]', id);
      });

      if (data.image) {
        formData.append('image', data.image);
      }

      if (data.file_song) {
        formData.append('file_song', data.file_song);
      }

      await dispatch(uploadSong(formData)).unwrap();
      
      setNotification({
        open: true,
        message: 'Bài hát đã được tải lên thành công!',
        type: 'success'
      });
      
      onUploadSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setNotification({
        open: true,
        message: 'Có lỗi xảy ra khi tải lên bài hát!',
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
      aria-labelledby="upload-track-modal"
      aria-describedby="upload-track-modal-description"
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
          Upload New Track
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Left Column - Basic Information */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Basic Information
              </Typography>

              {/* Title */}
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Title" fullWidth error={!!errors.title} helperText={errors.title?.message} />
                )}
              />

              {/* Release Date */}
              <Controller
                name="releaseDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" label="Release Date" fullWidth InputLabelProps={{ shrink: true }} />
                )}
              />

              {/* Genres */}
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
                          {selected.map((value) => {
                            const genre = genres.find(g => g.id === value);
                            return (
                              <Chip
                                key={value}
                                label={genre?.name}
                                sx={{
                                  backgroundColor: 'rgba(147, 51, 234, 0.2)',
                                  color: 'white',
                                  '& .MuiChip-deleteIcon': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                      color: '#ef4444'
                                    }
                                  }
                                }}
                              />
                            );
                          })}
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

              {/* Albums */}
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
                          {selected.map((value) => {
                            const album = albums.find(a => a.id === value);
                            return (
                              <Chip
                                key={value}
                                label={album?.title}
                                sx={{
                                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                  color: 'white',
                                  '& .MuiChip-deleteIcon': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                      color: '#ef4444'
                                    }
                                  }
                                }}
                              />
                            );
                          })}
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

              {/* Premium Switch */}
              <FormControlLabel
                control={
                  <Controller
                    name="is_premium"
                    control={control}
                    render={({ field }) => (
                      <Switch {...field} checked={field.value} />
                    )}
                  />
                }
                label="Premium Track"
              />
            </Box>

            {/* Right Column - Media and Lyrics */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Media and Lyrics
              </Typography>

              {/* Image Upload */}
              <Box sx={{ flex: 1 }}>
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
                        <Box
                          sx={{
                            border: '2px dashed rgba(255,255,255,0.3)',
                            borderRadius: '12px',
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            height: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                              borderColor: '#3B82F6',
                              backgroundColor: 'rgba(59,130,246,0.1)',
                            },
                          }}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '180px',
                                borderRadius: '8px',
                              }}
                            />
                          ) : (
                            <>
                              <ImageIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.7)' }} />
                              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                                Upload Cover Image
                              </Typography>
                            </>
                          )}
                        </Box>
                      </label>
                    </>
                  )}
                />
              </Box>

              {/* Song Upload */}
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="file_song"
                  control={control}
                  rules={{ required: 'File bài hát là bắt buộc' }}
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
                        <Box
                          sx={{
                            border: '2px dashed rgba(255,255,255,0.3)',
                            borderRadius: '12px',
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            height: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                              borderColor: '#3B82F6',
                              backgroundColor: 'rgba(59,130,246,0.1)',
                            },
                          }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.7)' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                            {selectedFileName || 'Upload Song File'}
                          </Typography>
                          {errors.file_song && (
                            <Typography color="error" variant="caption">
                              {errors.file_song.message}
                            </Typography>
                          )}
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
                  <TextField {...field} label="Lyrics" multiline rows={6} fullWidth />
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
              {isSubmitting ? <CircularProgress size={24} /> : 'Upload'}
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

export default UploadTrack;