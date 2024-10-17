import React, { useState } from 'react';
import { Tabs, Tab, Avatar, TextField, Button, Paper, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

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

const AdminProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper elevation={3} className="overflow-hidden">
      <Grid container>
        <Grid item xs={12} md={12} className="bg-gradient-to-b from-cyan-400 to-indigo-700 p-6 text-white">
          <div className="flex flex-col items-center space-y-4">
            <Avatar
              src={user.avatar || '/default-avatar.png'}
              alt={user.username}
              className="w-32 h-32 border-4 border-white"
            />
            <Typography variant="h5" className="font-bold">{user.username}</Typography>
            <Typography variant="subtitle1" className="text-indigo-200">Music Enthusiast</Typography>
            <div className="flex justify-around w-full mt-6">
              <div className="text-center">
                <Typography variant="h6">86</Typography>
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
              <Typography variant="body2" className="mb-2">Email</Typography>
              <Typography variant="body1">{user.email}</Typography>
              <Typography variant="body2" className="mt-4 mb-2">Location</Typography>
              <Typography variant="body1">New York, USA</Typography>
              <Typography variant="body2" className="mt-4 mb-2">Member Since</Typography>
              <Typography variant="body1">January 2022</Typography>
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
                <Button variant="outlined" startIcon={<EditIcon />}>Edit Profile</Button>
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
              <div>
                <Typography variant="h6" className="mb-4">Account Settings</Typography>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={user.username}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={user.email}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Birthday"
                  type="date"
                  variant="outlined"
                  value={user.birthday || ''}
                  InputLabelProps={{ shrink: true }}
                  className="mb-4"
                />
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminProfile;