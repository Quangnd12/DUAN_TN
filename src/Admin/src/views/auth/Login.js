import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
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
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../../../redux/slice/apiSlice";
import { setCredentials } from "../../../../redux/slice/authSlice";
import ForgotPassword from "./Forgot";
import { signInWithGoogle } from "../../../../config/firebaseConfig";
import { checkAuth } from "../../../../redux/slice/authSlice";

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
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (localStorage.getItem("accessToken")) {
        try {
          await dispatch(checkAuth()).unwrap();
          navigate("/admin/dashboard", { replace: true });
        } catch (error) {
          console.error("Error verifying auth:", error);
          // Xử lý lỗi nếu cần
        }
      }
    };
    
    checkAuthStatus();
  }, [dispatch, navigate]);
  

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
  
    try {
      const response = await login({
        email: data.email,
        password: data.password,
        rememberMe: rememberMe 
      }).unwrap();      
      // Update Redux store with both tokens
      dispatch(
        setCredentials({
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
          rememberMe
        })
      );
  
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { user, token: googleToken } = await signInWithGoogle();
      const response = await googleLogin({idToken: googleToken}).unwrap();

      sessionStorage.setItem("user", JSON.stringify(response.user));
      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        })
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.data?.message || "Google sign in failed. Please try again.");
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
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Forgot Password" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TabPanel value={tabValue} index={0}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Email"
                  fullWidth
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox {...register("rememberMe")} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />
                  }
                  label="Remember Me"
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  startIcon={
                    <img
                      src={`/images/logo/Google.png`}
                      alt="Google Icon"
                      style={{ width: 20, height: 20 }}
                    />
                  }
                  sx={{ mt: 2 }}
                >
                   {loading ? <CircularProgress size={24} /> : "Sign in with Google"}
                </Button>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ForgotPassword />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
