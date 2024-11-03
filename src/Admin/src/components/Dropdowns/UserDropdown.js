// src/components/Dropdowns/UserDropdown.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar, Button, Menu, MenuItem, Typography, Box, CircularProgress } from "@mui/material";
import { logout } from "../../../../redux/slice/authSlice";

const UserDropdown = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have user data either from props or sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser || user) {
      setIsLoading(false);
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  // Show loading state while checking user data
  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  // Get user data from props or sessionStorage
  const userData = user || JSON.parse(sessionStorage.getItem("user"));

  // If still no user data after loading, return null
  if (!userData || !userData.username) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center">
      <Button 
        onClick={handleMenuOpen} 
        style={{ textTransform: "none" }}
        className="hover:bg-gray-100 rounded-full p-2"
      >
        <Avatar
          src={userData.avatar || "/images/default-avatar.png"}
          alt={userData.username}
          sx={{ 
            width: 32, 
            height: 32, 
            marginRight: 1,
            border: '2px solid #e5e7eb'
          }}
        />
        <Typography variant="subtitle1" className="text-gray-700">
          {userData.username}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ 
          sx: { 
            width: 200,
            mt: 1,
            '& .MuiMenuItem-root': {
              py: 1
            }
          } 
        }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate(`/admin/info/${userData.id}`);
        }}>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate("/admin/settings");
        }}>
          <Typography>Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserDropdown;