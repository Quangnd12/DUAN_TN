// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

// Thêm hàm kiểm tra role và redirect URL
const checkRoleAccess = (role, pathname) => {
  // Kiểm tra xem user có được phép truy cập route hiện tại không
  if (role === "user" && pathname.startsWith("/admin")) {
    return false;
  }
  return true;
};

// Thêm action mới để lưu thông tin user vào localStorage
const saveUserToStorage = (user, pathname) => {
  try {
    // Kiểm tra quyền truy cập trước khi lưu
    if (!checkRoleAccess(user.role, pathname)) {
      throw new Error("Unauthorized access");
    }
    localStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to storage:", error);
    // Xóa thông tin đăng nhập nếu không có quyền truy cập
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    throw error;
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
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const storedUser = loadUserFromStorage();
      const currentPath = window.location.pathname;

      if (storedUser && !checkRoleAccess(storedUser.role, currentPath)) {
        throw new Error("Unauthorized access");
      }

      if (storedUser) {
        return { user: storedUser, token };
      }

      const response = await dispatch(
        apiSlice.endpoints.getUser.initiate("me")
      ).unwrap();

      // Kiểm tra quyền truy cập trước khi lưu user mới
      if (!checkRoleAccess(response.role, currentPath)) {
        throw new Error("Unauthorized access");
      }
      sessionStorage.setItem("user", JSON.stringify(response));
      return { user: response, token };
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
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
      const currentPath = window.location.pathname;

      try {
        if (user && checkRoleAccess(user.role, currentPath)) {
          state.user = user;
          state.role = user.role;
          saveUserToStorage(user, currentPath);
        }
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          localStorage.setItem("accessToken", token);
        }
        state.isLoading = false;
        state.error = null;
      } catch (error) {
        // Reset state nếu không có quyền truy cập
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
        state.error = "Unauthorized access";
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
        // Tạo một bản sao của toàn bộ đối tượng state.user và merge với payload
        state.user = {
          ...state.user, 
          ...action.payload
        };
    
        // Nếu có thay đổi role thì cập nhật lại role trong state
        if (action.payload.role) {
          state.role = action.payload.role;
        }
    
        // Cập nhật lại sessionStorage
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
          const currentPath = window.location.pathname;
          if (checkRoleAccess(action.payload.user.role, currentPath)) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role;
            sessionStorage.setItem("user", JSON.stringify(action.payload.user));
          } else {
              // Reset state nếu không có quyền truy cập
              state.isAuthenticated = false;
              state.user = null;
              state.token = null;
              state.role = null;
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
              sessionStorage.removeItem("user");
          }
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
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setCredentials, logout, setError, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
