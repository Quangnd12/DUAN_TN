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

// Hàm kiểm tra trạng thái xác thực
export const checkAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  const lastLoginTime = sessionStorage.getItem("lastLoginTime");

  // Nếu có token và user data
  if (accessToken && user) {
    const currentTime = Date.now();
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

    // Kiểm tra session time
    if (lastLoginTime && currentTime - parseInt(lastLoginTime) < sessionTimeout) {
      // Xóa flag isLoggedOut nếu có
      sessionStorage.removeItem("isLoggedOut");
      return true;
    }
  }

  // Clear auth data if session expired
  if (!lastLoginTime) {
    localStorage.clear();
    sessionStorage.clear();
  }

  return false;
};

// Interceptor để xử lý token trong header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Xử lý khi token hết hạn
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("lastLoginTime");
      sessionStorage.setItem("isLoggedOut", "true");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Các service cho authentication
export const authService = {
  // Đăng ký người dùng mới
  register: async (userData, rememberMe = false) => {
    try {
      const response = await api.post("/auth/register", userData);
      // Lưu token vào localStorage nếu rememberMe được chọn
      if (rememberMe && response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng nhập
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await api.post("/auth/login", credentials);
      // Lưu thông tin đăng nhập vào localStorage nếu rememberMe được chọn
      if (rememberMe && response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("lastLoginTime", Date.now().toString());
        sessionStorage.removeItem("isLoggedOut");
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng nhập với Google
  googleLogin: async (idToken, rememberMe = false) => {
    try {
      const response = await api.post("/auth/login/google", { idToken });
      // Lưu token vào localStorage nếu rememberMe được chọn
      if (rememberMe && response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("lastLoginTime", Date.now().toString());
        sessionStorage.removeItem("isLoggedOut");
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("lastLoginTime");
      sessionStorage.setItem("isLoggedOut", "true");
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Các service cho user management
export const userService = {
  // Lấy thông tin người dùng theo ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/auth/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách tất cả người dùng
  getAllUsers: async () => {
    try {
      const response = await api.get("/auth");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách người dùng phân trang
  getPaginatedUsers: async (page = 1) => {
    try {
      const response = await api.get(`/auth?page=${page}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, userData) => {
    try {
      let formData = new FormData();
      // Thêm các trường thông tin vào formData
      Object.keys(userData).forEach((key) => {
        if (key === "avatar" && userData[key] instanceof File) {
          formData.append(key, userData[key]);
        } else if (userData[key] !== undefined && userData[key] !== null) {
          formData.append(key, userData[key]);
        }
      });

      const response = await api.put(`/auth/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload avatar
  uploadAvatar: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post(`/auth/upload-avatar/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/auth/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;