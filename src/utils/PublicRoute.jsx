import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Cho phép truy cập các route đăng ký/đăng nhập
  const isAuthRoute = 
    location.pathname.includes('/auth/login') || 
    location.pathname.includes('/artist-portal/auth/login') ||
    location.pathname.includes('/artist-portal/auth/register');

  if (isAuthenticated) {
    // Nếu đang ở route đăng ký/đăng nhập và đã xác thực
    if (isAuthRoute) {
      // Điều hướng dựa trên role
      if (role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (role === 'artist') {
        return <Navigate to="/artist/dashboard" replace />;
      }
      // Mặc định redirect về trang chủ
      return <Navigate to="/" replace />;
    }
  }

  return children;
};