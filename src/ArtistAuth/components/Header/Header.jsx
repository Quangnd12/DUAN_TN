import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem,
  Box,
  Container
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon, 
  Logout as LogoutIcon,
  MusicNote as MusicNoteIcon,
} from '@mui/icons-material';
import { logoutArtist } from '../../../redux/slice/artistAuthSlice';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../Modal/ProfileModal';

const ArtistHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artist } = useSelector((state) => state.artistAuth);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutArtist());
    navigate('/artist-portal/auth/login');
  };

  const handleProfileEdit = () => {
    setIsProfileModalOpen(true);
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ 
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Container maxWidth="xl">
          <Toolbar className="flex justify-between items-center py-2">
            <Box className="flex items-center space-x-2">
              <MusicNoteIcon className="text-purple-400 text-3xl" />
              <Typography 
                variant="h5" 
                component="div" 
                className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              >
                Artist Studio
              </Typography>
            </Box>

            <Box className="flex items-center space-x-6">
          

              <Box className="flex items-center space-x-3">
                <Typography 
                  variant="subtitle1" 
                  className="hidden md:block text-white/90 font-medium"
                >
                  {artist?.stage_name || 'Artist'}
                </Typography>
                
                <IconButton 
                  onClick={handleMenuOpen}
                  className="border-2 border-purple-500/30 hover:border-purple-500 transition-all p-1"
                >
                  <Avatar 
                    src={artist?.avatar || '/default-avatar.png'} 
                    alt={artist?.stage_name || 'Artist Avatar'}
                    className="w-8 h-8"
                    sx={{
                      boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
                    }}
                  />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      mt: 1.5,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        '&:hover': {
                          background: 'rgba(147, 51, 234, 0.2)'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem onClick={handleProfileEdit}>
                    <AccountCircleIcon className="mr-2 text-purple-400" /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon className="mr-2 text-red-400" /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <ProfileModal 
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default ArtistHeader;