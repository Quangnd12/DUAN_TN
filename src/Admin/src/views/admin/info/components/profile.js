import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import {
  setCredentials,
  logout,
} from "../../../../../../redux/slice/authSlice";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from "../../../../../../redux/slice/apiSlice";
import UserAvatar from "./avatar";
import ProfileTabs from "./tabs";
import AccountSettingsForm from "./accountSettingsForm";
import LogoutDialog from "./logoutDialog";

const AdminProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const avatarInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    birthday: user?.birthday || "",
  });

  const [initialFormData, setInitialFormData] = useState({
    username: user?.username || "",
    birthday: user?.birthday || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        birthday: user.birthday || "",
      });
    }
  }, [user]);

  const { data: userData, refetch } = useGetUserQuery(user?.id, {
    skip: !user?.id,
    refetchOnMountOrArgChange: true,
  });

  const [updateUser] = useUpdateUserMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  const checkFieldChanges = () => {
    const changedFields = Object.keys(formData).filter(
      (key) => formData[key] !== initialFormData[key]
    );
    return changedFields.length === 1;
  };

  const hasChanges = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== initialFormData[key]
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await uploadAvatar({
        id: user.id,
        file,
      }).unwrap();

      dispatch(
        setCredentials({
          user: {
            ...user,
            avatar: response.avatar,
          },
          token: user.token,
        })
      );

      refetch();

      setSnackbar({
        open: true,
        message: "Avatar updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update avatar",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkFieldChanges()) {
      setSnackbar({
        open: true,
        message:
          "Please update both username and birthday fields to save changes.",
        severity: "warning",
      });
      return;
    }

    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes detected.",
        severity: "info",
      });
      return;
    }

    try {
      if (!user?.id) return;

      const updatedUserData = await updateUser({
        id: user.id,
        ...formData,
      }).unwrap();

      dispatch(
        setCredentials({
          user: {
            ...user,
            ...updatedUserData,
          },
          token: user.token,
        })
      );

      await refetch();

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      setLogoutDialogOpen(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update profile",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSnackbar({
      open: true,
      message: "Changes cancelled",
      severity: "info",
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <Typography>No user data available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={3} className="overflow-hidden">
        <Grid container>
          <Grid
            item
            xs={12}
            className="bg-gradient-to-b from-cyan-400 to-indigo-700 p-6 text-white"
          >
            <UserAvatar
              user={user}
              onAvatarClick={handleAvatarClick}
              onAvatarUpload={handleAvatarUpload}
              avatarInputRef={avatarInputRef} // Truyền ref vào component
            />
          </Grid>

          <Grid item xs={12} className="p-6">
            <ProfileTabs
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />
            <div className="mt-6">
              {activeTab === 0 && (
                <AccountSettingsForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  hasChanges={() =>
                    Object.keys(formData).some(
                      (key) => formData[key] !== initialFormData[key]
                    )
                  }
                  handleCancel={handleCancel}
                />
              )}
              {activeTab === 1 && (
                <div>
                  <Typography variant="h6" className="mb-4">
                    My Playlists
                  </Typography>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <Typography variant="h6" className="mb-4">
                    My Favorites
                  </Typography>
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <Typography variant="h6" className="mb-4">
                    My History
                  </Typography>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
        onLogout={handleLogout}
      />
    </>
  );
};

export default AdminProfile;
