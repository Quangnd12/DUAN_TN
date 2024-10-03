// src/services/Api_url.jsx

import axios from 'axios';

// URL cơ bản của API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cho phép gửi cookie cùng với mỗi yêu cầu
});

// Interceptor để xử lý request, thêm token nếu có
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh-token', { token: refreshToken });
        
        // Lưu token mới
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // Thêm token mới vào header của request
        api.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Nếu không thể làm mới token, quay về trang đăng nhập
        console.error('Token refresh error:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Chuyển hướng đến trang đăng nhập hoặc thông báo cho người dùng
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// API đăng ký người dùng mới
export const registerUser = async (email, password) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// API đăng nhập người dùng
export const loginUser = async (email, password, rememberMe) => {
  try {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    // Lưu token vào localStorage sau khi đăng nhập thành công
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (error) {
    throw error.response.data;
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

// API đăng xuất người dùng
export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error.response?.data || { message: 'Logout failed.' };
  }
};

// API quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgotPassword', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send email');
  }
};

// API đặt lại mật khẩu
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.patch(`/auth/resetPassword/${token}`, { password: newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// API đăng ký bằng Google
export const registerWithGoogle = async (idToken) => {
  try {
    const response = await api.post('/auth/googleSignIn', { idToken });
    // Lưu token vào localStorage sau khi đăng ký thành công bằng Google
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
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
