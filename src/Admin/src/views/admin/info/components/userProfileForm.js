import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { setCredentials } from '../../../../../../redux/slice/authSlice';
import { useTheme } from '../../ThemeContext'; // Import useTheme hook
import { translations } from '../../../../components/Translation/translation';
import { 
  useUpdateUserMutation,
  useGetUserQuery,
  useLogoutMutation
} from '../../../../../../redux/slice/apiSlice';
import LogoutDialog from './logoutDialog';
import ProfileTabs from './tabs';
import UserPlaylist from './userPlaylist';
import UserFavorites from './userFavorites';

const UserProfileForm = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [logout] = useLogoutMutation();
  const { language } = useTheme(); 
  const t = translations[language];
  
  // State for dialog and editing mode
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    username: false,
    birthday: false
  });
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    birthday: user?.birthday || '',
    avatar: user?.avatar || null,
    avatarFile: null
  });

  const [initialFormData, setInitialFormData] = useState({
    username: user?.username || '',
    birthday: user?.birthday || '',
    avatar: user?.avatar || null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.avatar || '/default-avatar.png');

  const { refetch } = useGetUserQuery(user?.id, {
    skip: !user?.id
  });

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || '',
        birthday: user.birthday || '',
        avatar: user.avatar || null
      };
      setFormData(prev => ({ ...prev, ...userData }));
      setInitialFormData(userData);
      setPreviewImage(user.avatar || '/default-avatar.png');
    }
  }, [user]);

  const validateForm = () => {
    const errors = {
      username: !formData.username.trim(),
      birthday: !formData.birthday
    };

    setValidationErrors(errors);

    if (errors.username || errors.birthday) {
      setSnackbar({
        open: true,
        message: t.userProfile.requiredFields,
        severity: 'error'
      });
      return false;
    }

    return true;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setPreviewImage(initialFormData.avatar || '/default-avatar.png');
    setValidationErrors({
      username: false,
      birthday: false
    });
    setSnackbar({
      open: true,
      message: t.userProfile.changesCancelled,
      severity: 'info'
    });
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Clear any stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Navigate to admin login
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setSnackbar({
        open: true,
        message: t.userProfile.logoutFailed,
        severity: 'error'
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      const submitData = new FormData();
      submitData.append('username', formData.username.trim());
      submitData.append('birthday', formData.birthday);
      if (formData.avatarFile) {
        submitData.append('avatar', formData.avatarFile);
      }
  
      const updatedUserData = await updateUser({
        id: user.id,
        formData: submitData
      }).unwrap();
  
      dispatch(setCredentials({
        user: {
          ...user,
          ...updatedUserData
        },
        token: user.token
      }));
  
      await refetch();
  
      setInitialFormData({
        username: updatedUserData.username,
        birthday: updatedUserData.birthday,
        avatar: updatedUserData.avatar
      });
  
      setFormData(prev => ({
        ...prev,
        avatarFile: null
      }));

      setIsEditing(false);
      
      // Show success message before logout dialog
      setSnackbar({
        open: true,
        message: t.userProfile.updateSuccess,
        severity: 'success'
      });

      // Delay showing logout dialog
      setTimeout(() => {
        setShowLogoutDialog(true);
      }, 1500);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || t.userProfile.updateFailed,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProfileContent = () => (
    <Box className="relative">
      {isSubmitting && (
        <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
          <CircularProgress size={50} />
        </Box>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} className="flex justify-center">
          <Box className="text-center relative">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={!isEditing}
            />
            <Avatar
              src={previewImage}
              alt={formData.username || 'User'}
              className={`w-32 h-32 mx-auto mb-4 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={handleAvatarClick}
              sx={{ width: 128, height: 128 }}
            />
            {isEditing && (
              <Typography variant="caption" className="text-gray-600">
               {t.userProfile.clickToChangeAvatar}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t.userDropdown.profile}
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={!isEditing || isSubmitting}
            error={validationErrors.username}
            helperText={validationErrors.username ? t.userProfile.usernameRequired : ''}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t.userProfile.birthday}
            name="birthday"
            type="date"
            value={formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            disabled={!isEditing || isSubmitting}
            error={validationErrors.birthday}
            helperText={validationErrors.birthday ? t.userProfile.birthdayRequired : ''}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Box className="flex justify-end space-x-4">
            {!isEditing ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                 {t.userProfile.editProfile}
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                    {t.playlist.cancel}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                   {t.userProfile.saveChanges}
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderProfileContent();
      case 1:
        return <UserPlaylist />;
      case 2:
        return <UserFavorites />;
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} className="p-6">
      <ProfileTabs activeTab={activeTab} handleTabChange={handleTabChange} />
      
      <Box className="mt-6">
        {renderTabContent()}
      </Box>

      <LogoutDialog
        open={showLogoutDialog}
        onClose={() => {
          setShowLogoutDialog(false);
          navigate('/admin/dashboard', { replace: true });
        }}
        onLogout={handleLogout}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserProfileForm;