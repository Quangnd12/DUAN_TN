import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import { BASE_URL } from '../../config/index';

const setToken = (token) => {
  if (token) {
    localStorage.setItem('artistToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('artistToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const saveArtistToLocalStorage = (artist) => {
  localStorage.setItem('artist', JSON.stringify(artist));
};

const clearArtistFromLocalStorage = () => {
  localStorage.removeItem('artist');
};

// Kiểm tra và lấy thông tin nghệ sĩ từ localStorage
const getArtistFromLocalStorage = () => {
  const artistData = localStorage.getItem('artist');
  return artistData ? JSON.parse(artistData) : null;
};

export const checkAuthStatus = createAsyncThunk(
  'artistAuth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('artistToken');
    const storedArtist = getArtistFromLocalStorage();

    if (!token || !storedArtist) {
      return rejectWithValue('No authentication data');
    }

    try {
      // Validate token với backend

      return {
        token,
        artist: storedArtist
      };
    } catch (error) {
      // Nếu token không hợp lệ, xóa dữ liệu
      clearArtistFromLocalStorage();
      setToken(null);
      return rejectWithValue('Token validation failed');
    }
  }
);

// Async thunk for artist registration
export const registerArtist = createAsyncThunk(
  'artistAuth/register',
  async (artistData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/artist/auth/register`, artistData);
      
      // Không lưu token và artist vào localStorage sau khi đăng ký
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

// Async thunk for artist login
export const loginArtist = createAsyncThunk(
  'artistAuth/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/artist/auth/login`, {
        email,
        password,
        rememberMe
      });
      const { token, artist } = response.data;
      
      setToken(token);
      saveArtistToLocalStorage(artist);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Async thunk for Google registration
export const googleLogin = createAsyncThunk(
  'artistAuth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Mở popup đăng nhập Google
      const result = await signInWithPopup(auth, provider);
      
      // Lấy ID token
      const googleToken = await result.user.getIdToken();
      
      // Gửi token trong request
      const response = await axios.post(
        `${BASE_URL}/api/artist/auth/login-google`, 
        { googleToken }
      );
      
      if (response.data.artist && response.data.token) {
        setToken(response.data.token);
        saveArtistToLocalStorage(response.data.artist);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Google login failed');
    }
  }
);

// Tương tự cho googleRegister
export const googleRegister = createAsyncThunk(
  'artistAuth/googleRegister',
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const googleToken = await result.user.getIdToken();
      
      const response = await axios.post(
        `${BASE_URL}/api/artist/auth/register-google`, 
        { googleToken }
      );
      
      setToken(response.data.token);
      saveArtistToLocalStorage(response.data.artist);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Google registration failed');
    }
  }
);

// Async thunk for profile update
export const updateArtistProfile = createAsyncThunk(
  'artistAuth/updateProfile',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/artist/auth/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Lưu thông tin nghệ sĩ mới vào localStorage
      if (response.data.artist) {
        saveArtistToLocalStorage(response.data.artist);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Profile update failed'
      );
    }
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'artistAuth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Forgot password request failed');
    }
  }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
  'artistAuth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/artist/auth/reset-password`, {
        token,
        password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Password reset failed');
    }
  }
);

// Async thunk for logout
export const logoutArtist = createAsyncThunk(
  'artistAuth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/api/artist/auth/logout`);
      setToken(null);
      localStorage.removeItem('artist');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Async thunk for sending password reset email
export const sendPasswordResetEmail = createAsyncThunk(
  'artistAuth/sendPasswordResetEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/artist/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send password reset email');
    }
  }
);

// Initial state for artist authentication
const initialState = {
  artist: JSON.parse(localStorage.getItem('artist')) || null,
  isAuthenticated: !!localStorage.getItem('artistToken'),
  loading: false,
  error: null,
  token: localStorage.getItem('artistToken'),
  role: 'artist',
};

// Create artist authentication slice
const artistAuthSlice = createSlice({
  name: 'artistAuth',
  initialState,
  reducers: {
    // Additional synchronous reducers can be added here if needed
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.artist = action.payload.artist;
      state.token = action.payload.token;
    });
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.artist = null;
      state.token = null;
    });
    // Registration reducers
    builder.addCase(registerArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerArtist.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(registerArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login reducers
    builder.addCase(loginArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginArtist.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.artist = action.payload.artist;
      state.token = action.payload.token;
      state.role = 'artist';

      setToken(action.payload.token);
    });
    builder.addCase(loginArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Google registration reducers
    builder.addCase(googleRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(googleRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.artist = action.payload.artist;
      state.token = action.payload.token;
    });
    builder.addCase(googleRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Google login reducers
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.artist = action.payload.artist;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.artist = null;
        state.token = null;
      });

    // Logout reducers
    builder.addCase(logoutArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutArtist.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.artist = null;
      state.token = null;
    });
    builder.addCase(logoutArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Profile update reducers
    builder.addCase(updateArtistProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateArtistProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.artist = { ...state.artist, ...action.payload.artist };
    });
    builder.addCase(updateArtistProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reset password reducers
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = artistAuthSlice.actions;
export default artistAuthSlice.reducer;