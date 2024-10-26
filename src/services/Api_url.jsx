// src/services/Api_url.jsx

import axios from "axios";

// URL cơ bản của API
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Tạo instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookie cùng với mỗi yêu cầu
});

// Thêm function kiểm tra role
const checkUserRole = (userData) => {
  if (!userData || !userData.role) return false;
  return userData.role === 'admin';
};

// Interceptor để xử lý request, thêm token nếu có
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response, làm mới token nếu cần
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 và không phải lỗi khi làm mới token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API làm mới token (có thể bạn cần tạo một endpoint mới cho việc này)
    
        const response = await api.post("/auth/refresh-token");
        const { accessToken, isRemembered } = response.data;
        // Lưu token mới
        localStorage.setItem("accessToken", accessToken);

        // Thêm token mới vào header của request
        api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Cập nhật thông tin rememberMe nếu cần
        if (typeof isRemembered !== "undefined") {
          localStorage.setItem("rememberMe", isRemembered);
        }

        return api(originalRequest);
      } catch (err) {
        // Nếu không thể làm mới token, quay về trang đăng nhập
        localStorage.clear();
     
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// API đăng ký người dùng mới
export const registerUser = async (email, password) => {
  try {
    const response = await api.post("/auth/register", { email, password });
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// API đăng nhập người dùng
export const loginUser = async (email, password, birthday, rememberMe = false, googleToken = null) => {
  try {
    const payload = googleToken 
      ? { googleToken, rememberMe }
      : { email, password, rememberMe, birthday };
      
    const response = await api.post('/auth/login', payload);
    
    // Kiểm tra role
    if (!checkUserRole(response.data.user)) {
      throw new Error("Bạn không có quyền truy cập vào trang quản trị");
    }

    // Lưu thông tin đăng nhập nếu là admin
    if (response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('rememberMe', rememberMe);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('lastLoginTime', Date.now().toString());
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Login failed' };
  }
};

// API cập nhật thông tin người dùng
export const updateUserInfo = async (userId, updatedInfo) => {
  try {
    const response = await api.put(`/users/${userId}`, updatedInfo);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// API lấy thông tin người dùng theo ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// API lấy tất cả thông tin người dùng với tùy chọn giới hạn và phân trang
export const getAllUsers = async (page = 1, limit = 5, searchTerm = "") => {
  try {
    const response = await api.get("/admin/users", {
      params: { page, limit, searchTerm }, // Truyền searchTerm vào
    });

    if (!response.data || !response.data.users) {
      throw new Error("Invalid response format from server");
    }

    return {
      users: response.data.users,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
      totalUsers: response.data.totalUsers,
    };
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch users." };
  }
};

// API đăng xuất người dùng
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.clear();
    sessionStorage.clear();

    return { message: 'Logged out successfully' };
  } catch (error) {
    localStorage.clear();
    sessionStorage.clear();
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// API quên mật khẩu
export const forgotPassword = async (email, isAdmin = false) => {
  try {
    const response = await api.post("/auth/forgotPassword", { email, isAdmin });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reset password email' };
  }
};

// API đặt lại mật khẩu
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.patch(`/auth/resetPassword/${token}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// API đăng nhập bằng Google
export const googleSignIn = async (idToken, rememberMe = false) => {
  try {
    const response = await api.post('/auth/googleSignIn', { idToken, rememberMe });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('rememberMe', rememberMe);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Google sign-in failed' };
  }
};

// API làm mới token
export const refreshUserToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token');
    const { accessToken, isRemembered } = response.data;
    localStorage.setItem('accessToken', accessToken);
    if (typeof isRemembered !== 'undefined') {
      localStorage.setItem('rememberMe', isRemembered);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Token refresh failed' };
  }
};

// API đăng ký bằng Google
export const registerWithGoogle = async (idToken) => {
  try {
    const response = await api.post("/auth/googleSignIn", { idToken });
    // Lưu token vào localStorage sau khi đăng ký thành công bằng Google
    localStorage.setItem("accessToken", response.data.accessToken);
    // localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    if (response.data.user) {
      // Đăng nhập hoặc đăng ký thành công
      return response.data;
    } else if (response.status === 404) {
      // Người dùng chưa đăng ký
      return { needsRegistration: true, email: response.data.email };
    }
  } catch (error) {
    throw error.response.data;
  }
};

// Export mặc định instance của axios
export default api;
