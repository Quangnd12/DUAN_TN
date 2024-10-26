import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Tab, 
  Avatar, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Typography, 
  Snackbar, 
  Alert, 
  Box, 
  Divider, 
  CircularProgress 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { getUserById, updateUserInfo } from '../../../../../../services/Api_url';

const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)({
  textTransform: 'none',
  minWidth: 0,
  padding: '12px 16px',
  color: 'rgba(0, 0, 0, 0.85)',
  '&.Mui-selected': {
    color: '#1890ff',
  },
});

const SettingsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(3),
  },
  '& .MuiButton-root': {
    marginRight: theme.spacing(2),
  },
}));

const AdminProfile = ({ user: initialUser }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    birthday: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('No user data found in localStorage');
        }

        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.id) {
          throw new Error('User ID not found');
        }

        const response = await getUserById(parsedUser.id);
        if (!response || !response.data) {
          throw new Error('Failed to fetch user data');
        }

        const fetchedUserData = response.data;
        setUserData(fetchedUserData);
        setFormData({
          username: fetchedUserData.username || '',
          birthday: fetchedUserData.birthday || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Failed to load user data',
          severity: 'error'
        });
      }
    };

    if (initialUser) {
      setUserData(initialUser);
      setFormData({
        username: initialUser.username || '',
        birthday: initialUser.birthday || '',
      });
    } else {
      fetchUserData();
    }
  }, [initialUser]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const currentUser = userData || initialUser;
      if (!currentUser || !currentUser.id) {
        throw new Error('User data not available');
      }

      const changedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== currentUser[key]) {
          changedData[key] = formData[key];
        }
      });

      if (Object.keys(changedData).length === 0) {
        setSnackbar({
          open: true,
          message: 'No changes to save',
          severity: 'info'
        });
        setLoading(false);
        return;
      }

      const response = await updateUserInfo(currentUser.id, changedData);
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  const displayUser = userData || initialUser;
  
  if (!displayUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography>No user data available</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} className="overflow-hidden">
      <Grid container>
        <Grid item xs={12} md={12} className="bg-gradient-to-b from-cyan-400 to-indigo-700 p-6 text-white">
          <div className="flex flex-col items-center space-y-4">
            <Avatar
              src={displayUser?.avatar || '/default-avatar.png'}
              alt={displayUser?.username || 'User'}
              className="w-32 h-32 border-4 border-white"
            />
            <Typography variant="h5" className="font-bold">{displayUser.username}</Typography>
            <Typography variant="subtitle1" className="text-indigo-200">Music Enthusiast</Typography>
            <div className="flex justify-around w-full mt-6">
              <div className="text-center">
                <Typography variant="h6">{displayUser?.playlistsId?.length || 0}</Typography>
                <Typography variant="body2">Playlists</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h6">4.5K</Typography>
                <Typography variant="body2">Followers</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h6">1.2K</Typography>
                <Typography variant="body2">Following</Typography>
              </div>
            </div>
            <div className="mt-6 w-full">
              <Typography variant="body1">Email: {displayUser?.email || 'N/A'}</Typography>
              <Typography variant="body1" className="mt-4 mb-2">
                Member Since: {displayUser?.birthday || 'N/A'}
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={12} className="p-6">
          <StyledTabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
            <StyledTab icon={<MusicNoteIcon />} label="About" />
            <StyledTab icon={<QueueMusicIcon />} label="Playlists" />
            <StyledTab icon={<FavoriteIcon />} label="Favorites" />
            <StyledTab icon={<HistoryIcon />} label="History" />
            <StyledTab icon={<SettingsIcon />} label="Settings" />
          </StyledTabs>

          <div className="mt-6">
            {activeTab === 0 && (
              <div>
                <Typography variant="h6" className="mb-4">About Me</Typography>
                <Typography variant="body1" className="mb-6">
                  Hi, I'm a music lover and playlist curator. I enjoy discovering new artists and creating the perfect mix for every mood.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                >
                  Edit Profile
                </Button>
              </div>
            )}

            {activeTab === 1 && (
              <div>
                <Typography variant="h6" className="mb-4">My Playlists</Typography>
                {/* Add playlist content here */}
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <Typography variant="h6" className="mb-4">Favorite Tracks</Typography>
                {/* Add favorite tracks content here */}
              </div>
            )}

            {activeTab === 3 && (
              <div>
                <Typography variant="h6" className="mb-4">Listening History</Typography>
                {/* Add listening history content here */}
              </div>
            )}

            {activeTab === 4 && (
              <SettingsSection>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Birthday"
                        type="date"
                        variant="outlined"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    {!isEditing ? (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        color="primary"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box display="flex" gap={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              username: displayUser?.username || '',
                              birthday: displayUser?.birthday || '',
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>
                </form>
              </SettingsSection>
            )}
          </div>
        </Grid>
      </Grid>

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

export default AdminProfile;