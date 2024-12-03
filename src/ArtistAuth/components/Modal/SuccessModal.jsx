import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

const SuccessModal = ({ open, onLogout }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          background: 'linear-gradient(to bottom right, #1a1a1a, #2d1a4a)',
          borderRadius: '20px',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          padding: '20px'
        }
      }}
    >
      <DialogContent>
        <Box className="text-center space-y-4">
          <Alert 
            severity="success" 
            sx={{ 
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: '#fff',
              '& .MuiAlert-icon': { color: '#4caf50' }
            }}
          >
            Profile updated successfully!
          </Alert>
          <Typography variant="body1" className="text-white mt-4">
            Please log out and log in again to see the changes.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className="justify-center pb-4">
        <Button
          onClick={onLogout}
          startIcon={<LogoutIcon className="text-white" />}
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
          Logout Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;