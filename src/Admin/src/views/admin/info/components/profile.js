import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import UserProfileForm from './userProfileForm';

const AdminProfile = ({ user }) => {
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="max-w-full mx-auto">
      <UserProfileForm user={user} />
    </Box>
  );
};

export default AdminProfile;