// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

// Thêm action mới để lưu thông tin user vào localStorage
const saveUserToStorage = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

const loadUserFromStorage = () => {
  try {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from sessionStorage:", error);
    return null;
  }
};

// Kiểm tra xác thực của người dùng
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const storedUser = loadUserFromStorage();
      if (storedUser) {
        return { user: storedUser, token };
      }

      const response = await dispatch(
        apiSlice.endpoints.getUser.initiate("me")
      ).unwrap();
      sessionStorage.setItem("user", JSON.stringify(response));
      return { user: response, token };
    } catch (error) {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      return rejectWithValue(error.message);
    }
  }
);

const storedUser = loadUserFromStorage();

const initialState = {
  user: storedUser,
  token: localStorage.getItem("accessToken"),
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  isLoading: false,
  error: null,
  role: storedUser?.role || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      if (user) {
        state.user = user;
        state.role = user.role;
        sessionStorage.setItem("user", JSON.stringify(user));
        saveUserToStorage(user);
      }
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", token);
      }
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.role = null;
      state.error = null;
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      if (state.user && action.payload) {
        state.user = { ...state.user, ...action.payload };
        state.role = action.payload.role || state.user.role;
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.role = action.payload.user.role;
          sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = null;
        state.isLoading = false;
        state.error = action.error.message;
        sessionStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setCredentials, logout, setError, updateUser } = authSlice.actions;
export default authSlice.reducer;