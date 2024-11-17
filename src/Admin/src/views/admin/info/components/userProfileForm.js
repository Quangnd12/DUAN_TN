import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
  Snackbar
} from '@mui/material';
import { setCredentials } from '../../../../../../redux/slice/authSlice';
import { 
  useUpdateUserMutation,
  useGetUserQuery,
  useLogoutMutation
} from '../../../../../../redux/slice/apiSlice';
import LogoutDialog from './logoutDialog';
import ProfileTabs from './tabs';

const UserProfileForm = ({ user }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [logout] = useLogoutMutation();
  
  // State for dialog
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // State for tabs
  const [activeTab, setActiveTab] = useState(0);
  
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
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const hasChanges = () => {
    return (
      formData.username !== initialFormData.username ||
      formData.birthday !== initialFormData.birthday ||
      formData.avatarFile !== null
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSnackbar({
      open: true,
      message: 'Changes cancelled',
      severity: 'info'
    });
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Additional logout logic if needed
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: 'No changes detected',
        severity: 'info'
      });
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      const submitData = new FormData();
      submitData.append('username', formData.username || '');
      submitData.append('birthday', formData.birthday || '');
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
      
      // Show logout dialog instead of success snackbar
      setShowLogoutDialog(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // About tab
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} className="flex justify-center">
                <Box className="text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Avatar
                    src={formData.avatar || '/default-avatar.png'}
                    alt={formData.username || 'User'}
                    className="w-32 h-32 cursor-pointer mx-auto mb-4"
                    onClick={handleAvatarClick}
                  />
                  <Typography variant="caption" className="text-gray-600">
                    Click to change avatar
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} className="flex justify-end space-x-4">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={!hasChanges() || isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!hasChanges() || isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} className="text-white" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      case 1: // Playlists tab
        return <div>Playlists Content</div>;
      case 2: // Favorites tab
        return <div>Favorites Content</div>;
      case 3: // History tab
        return <div>History Content</div>;
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
        onClose={() => setShowLogoutDialog(false)}
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