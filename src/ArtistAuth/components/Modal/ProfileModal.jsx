import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  TextField,
  Button,
  Avatar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { 
  Close as CloseIcon,
  PhotoCamera,
  MusicNote as MusicNoteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { updateArtistProfile, logoutArtist } from '../../../redux/slice/artistAuthSlice';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const ProfileModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artist, token, loading } = useSelector((state) => state.artistAuth);
  const [avatarPreview, setAvatarPreview] = useState(artist?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      stage_name: artist?.stage_name || '',
    }
  });

  useEffect(() => {
    if (artist) {
      reset({
        stage_name: artist.stage_name || '',
      });
      setAvatarPreview(artist.avatar || '');
    }
  }, [artist, reset]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutArtist());
    navigate('/artist-portal/auth/login');
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append('stage_name', data.stage_name.trim());

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await dispatch(updateArtistProfile({
        formData,
        token
      })).unwrap();

      console.log('Update response:', response); // Debug log

      // Kiểm tra response và hiển thị modal
      if (response) {
        setShowLogoutDialog(true); // Hiển thị modal thông báo
        onClose(); // Đóng modal chính
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            background: 'linear-gradient(to bottom right, #1a1a1a, #2d1a4a)',
            borderRadius: '20px',
            border: '1px solid rgba(147, 51, 234, 0.2)'
          }
        }}
      >
        <DialogContent className="relative">
          <IconButton
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white"
          >
            <CloseIcon />
          </IconButton>

          {/* Header */}
          <Box className="text-center mb-8 mt-4">
            <Box className="flex justify-center items-center gap-2 mb-2">
              <MusicNoteIcon className="text-purple-400" />
              <Typography variant="h5" className="font-bold text-white">
                Artist Profile
              </Typography>
            </Box>
            <Typography variant="body2" className="text-gray-400">
              Customize your artistic presence
            </Typography>
          </Box>

          {loading ? (
            <Box className="flex justify-center items-center h-[400px]">
              <CircularProgress className="text-purple-500" />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Section */}
              <Box className="flex flex-col items-center mb-8">
                <Box className="relative group">
                  <Avatar
                    src={avatarPreview}
                    alt="Profile Avatar"
                    sx={{
                      width: 180,
                      height: 180,
                      border: '4px solid rgba(147, 51, 234, 0.3)',
                      boxShadow: '0 0 30px rgba(147, 51, 234, 0.3)'
                    }}
                  />
                  <input
                    accept="image/*"
                    type="file"
                    id="avatar-upload-modal"
                    hidden
                    onChange={handleAvatarChange}
                  />
                  <label
                    htmlFor="avatar-upload-modal"
                    className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer
                             transform transition-all duration-300 hover:scale-110 hover:bg-purple-700"
                  >
                    <PhotoCamera className="text-white" />
                  </label>
                </Box>
                <Typography variant="body2" className="mt-2 text-gray-400">
                  {artist?.email}
                </Typography>
              </Box>

              {/* Form Fields */}
              <Box className="space-y-4">
                <Controller
                  name="stage_name"
                  control={control}
                  rules={{
                    required: 'Stage name is required',
                    minLength: {
                      value: 2,
                      message: 'Stage name must be at least 2 characters'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stage Name"
                      variant="outlined"
                      error={!!errors.stage_name}
                      helperText={errors.stage_name?.message}
                      InputProps={{
                        startAdornment: <EditIcon className="mr-2 text-purple-400" />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(147, 51, 234, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(147, 51, 234, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#9333EA' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(to right, #9333EA, #4F46E5)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    background: 'linear-gradient(to right, #7E22CE, #4338CA)',
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} className="text-white" />
                ) : (
                  'Update Profile'
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* SuccessModal */}
      <SuccessModal 
        open={showLogoutDialog} 
        onLogout={handleLogout}
      />
    </>
  );
};

export default ProfileModal;