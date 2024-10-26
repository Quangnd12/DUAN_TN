import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Box,
  Grid,
  Container,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PeopleIcon from "@mui/icons-material/People";
import { loginUser, googleSignIn } from "../../../../services/Api_url";
import { signInWithGoogle } from "../../../../config/firebaseConfig";
import ForgotPassword from "./Forgot";

const Feature = ({ Icon, title, description }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Icon sx={{ mr: 2, fontSize: 30, color: "primary.main" }} />
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Box>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Login() {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        const lastLoginTime = sessionStorage.getItem('lastLoginTime');
        
        // Nếu có token và user data
        if (accessToken && user) {
          const currentTime = Date.now();
          const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
          
          // Kiểm tra session time
          if (lastLoginTime && (currentTime - parseInt(lastLoginTime) < sessionTimeout)) {
            // Xóa flag isLoggedOut nếu có
            sessionStorage.removeItem('isLoggedOut');
            navigate('/admin/dashboard', { replace: true });
            return;
          }
        }
        
        // Clear auth data if session expired
        if (!lastLoginTime) {
          localStorage.clear();
          sessionStorage.clear();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.clear();
        sessionStorage.clear();
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Handle normal email/password login
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginUser(
        data.email,
        data.password,
        data.rememberMe
      );
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (response.token) {
        // Xóa flag đăng xuất và set thời gian đăng nhập mới
        sessionStorage.removeItem('isLoggedOut');
        sessionStorage.setItem('lastLoginTime', Date.now().toString());
        
        // Lưu token và thông tin user
        localStorage.setItem('accessToken', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      const errorMessage = err.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      // Xóa dữ liệu nếu đăng nhập thất bại
      localStorage.clear();
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
   const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const { user, token: idToken } = await signInWithGoogle();
      const response = await googleSignIn(idToken, true);

      if (response.accessToken) {
        // Xóa flag isLoggedOut nếu tồn tại
        sessionStorage.removeItem('isLoggedOut');
        
        // Set new session data
        sessionStorage.setItem('lastLoginTime', Date.now().toString());
        
        // Store auth data
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("rememberMe", "true");
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Sign in with Google failed. Please try again.";
      setError(errorMessage);
      
      // Clear auth data on error
      localStorage.clear();
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Music Heals Stream Administration
          </Typography>
          <Feature
            Icon={MusicNoteIcon}
            title="Content management"
            description="Easily add, edit, and delete songs and albums in the system."
          />
          <Feature
            Icon={QueueMusicIcon}
            title="Create playlists"
            description="Create and manage unique playlists for users."
          />
          <Feature
            Icon={EqualizerIcon}
            title="Data analysis"
            description="Track music listening trends and user interactions."
          />
          <Feature
            Icon={PeopleIcon}
            title="User management"
            description="Manage user accounts and access."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 4, width: "100%", maxWidth: 600, mx: "auto" }}
          >
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Forgot Password" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" align="center" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Email"
                  type="email"
                  placeholder="Please enter email"
                  fullWidth
                  margin="normal"
                  {...register("email", {
                    required: "Email cannot be blank",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
                <TextField
                  label="Password"
                  placeholder="Please enter your password"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("password", {
                    required: "Password cannot be blank",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("rememberMe")}
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label="Remember to log in"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 1 }}
                  disabled={loading}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Signing in...
                    </Box>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>

              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <img
                      style={{ width: 20, height: 20 }}
                      src="/images/logo/Google.png"
                      alt="Google Logo"
                    />
                  )
                }
              >
                {loading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ForgotPassword setError={setError} />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
