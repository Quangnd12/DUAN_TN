import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Google as GoogleIcon,
  LockOpen as LockOpenIcon,
  Email as EmailIcon,
  VpnKey as VpnKeyIcon,
  MusicNote as MusicNoteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  registerArtist,
  loginArtist,
  googleRegister,
  googleLogin,
} from "../../../redux/slice/artistAuthSlice";

const ArtistAuthForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.artistAuth);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      stage_name: "",
      rememberMe: false,
    },
    mode: "onChange"
  });

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated && activeTab === 0) {
      navigate("/artist-portal/dashboard");
    }
  }, [isAuthenticated, navigate, activeTab]);

  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        setActiveTab(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [registerSuccess]);

  const loginValidation = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters"
      }
    }
  };

  const registerValidation = {
    ...loginValidation,
    stage_name: {
      required: "Stage name is required",
      minLength: {
        value: 2,
        message: "Stage name must be at least 2 characters"
      },
      maxLength: {
        value: 50,
        message: "Stage name must not exceed 50 characters"
      }
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value) => value === password || "Passwords do not match"
    }
  };

  const onSubmit = async (data) => {
    try {
      if (activeTab === 0) {
        await dispatch(loginArtist({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        })).unwrap();
      } else {
        const response = await dispatch(registerArtist({
          email: data.email,
          password: data.password,
          stage_name: data.stage_name,
        })).unwrap();

        if (response) {
          setRegisterSuccess(true);
          reset();
          setTimeout(() => {
            setActiveTab(0);
          }, 2000);
        }
      }
    } catch (error) {
      console.error(activeTab === 0 ? "Login failed:" : "Registration failed:", error);
    }
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setRegisterSuccess(false);
    reset();
  };

  const handleGoogleAuth = () => {
    dispatch(activeTab === 0 ? googleLogin() : googleRegister());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-black/30 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden flex">
        <div className="w-1/2 p-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            className="mb-8"
            TabIndicatorProps={{
              style: {
                background: 'linear-gradient(to right, #9c27b0, #1976d2)',
                height: '3px'
              }
            }}
          >
            <Tab label="Login" className="text-lg" />
            <Tab label="Register" className="text-lg" />
          </Tabs>

          {error && (
            <Alert severity="error" className="mb-4" sx={{
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff5252',
            }}>
              {error}
            </Alert>
          )}

          {registerSuccess && (
            <Alert 
              severity="success" 
              className="mb-4"
              sx={{
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                color: '#4caf50',
                '& .MuiAlert-icon': {
                  color: '#4caf50'
                }
              }}
            >
              Registration successful! Please switch to the login tab and sign in with your credentials.
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {activeTab === 1 && (
              <Controller
                name="stage_name"
                control={control}
                rules={registerValidation.stage_name}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Stage Name"
                    error={!!errors.stage_name}
                    helperText={errors.stage_name?.message}
                    InputProps={{
                      startAdornment: <PersonIcon className="mr-2 text-purple-400" />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-input': { color: 'white' },
                      '& .MuiFormHelperText-root': { color: '#ff5252' },
                    }}
                  />
                )}
              />
            )}

            <Controller
              name="email"
              control={control}
              rules={loginValidation.email}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: <EmailIcon className="mr-2 text-purple-400" />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: '#ff5252' },
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={loginValidation.password}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: <LockOpenIcon className="mr-2 text-purple-400" />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: '#ff5252' },
                  }}
                />
              )}
            />

            {activeTab === 1 && (
              <Controller
                name="confirmPassword"
                control={control}
                rules={registerValidation.confirmPassword}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: <VpnKeyIcon className="mr-2 text-purple-400" />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiOutlinedInput-input': { color: 'white' },
                      '& .MuiFormHelperText-root': { color: '#ff5252' },
                    }}
                  />
                )}
              />
            )}

            {activeTab === 0 && (
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        {...field}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          '&.Mui-checked': {
                            color: '#9c27b0',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Remember me
                      </Typography>
                    }
                  />
                )}
              />
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                activeTab === 0 ? "Login" : "Register"
              )}
            </Button>
          </form>

          <Divider className="my-6 opacity-50">
            <span className="text-white/70">OR</span>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            disabled={loading}
            onClick={handleGoogleAuth}
            className="border-2 border-white/30 hover:border-white/50 backdrop-blur-sm"
            startIcon={<GoogleIcon />}
            sx={{
              color: 'white',
              padding: '12px',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            {activeTab === 0 ? "Login" : "Register"} with Google
          </Button>

          {activeTab === 0 && (
            <div className="flex justify-end mt-2">
              <Link to="/artist-portal/forgot-password" className="text-sm text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-10 bg-black/40 flex flex-col justify-center">
          <Typography variant="h3" className="mb-6 text-white font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Your Music Journey Starts Here
          </Typography>

          <div className="space-y-4 text-white/80">
            <div className="flex items-center space-x-3 backdrop-blur-sm bg-white/5 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <MusicNoteIcon />
              </div>
              <Typography variant="body1">
                Share your music with the world
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistAuthForm;
