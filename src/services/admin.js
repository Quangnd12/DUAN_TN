import api from './Api_url';

// API đăng nhập admin
export const loginAdmin = async (email, password, rememberMe) => {
  try {
    const response = await api.post('/admin/login', { email, password, rememberMe });
    // Lưu token vào localStorage sau khi đăng nhập thành công
    localStorage.setItem('adminAccessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// API quên mật khẩu admin
export const forgotPasswordAdmin = async (email) => {
  try {
    const response = await api.post('/admin/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reset email' };
  }
};

// API đặt lại mật khẩu admin
export const resetPasswordAdmin = async (token, newPassword) => {
  try {
    const response = await api.post('/admin/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

// API đăng xuất admin
export const logoutAdmin = async () => {
  try {
    const response = await api.post('/admin/logout');
    localStorage.removeItem('adminAccessToken');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// Gán vào biến trước khi export
const adminApi = {
  loginAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin,
  logoutAdmin
};

export default adminApi;
