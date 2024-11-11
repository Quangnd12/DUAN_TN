import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../redux/slice/authSlice';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, token, role  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token && !isAuthenticated && !isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, token, isAuthenticated, isLoading]);

  useEffect(() => {
    // Kiểm tra quyền truy cập mỗi khi location thay đổi
    if (isAuthenticated && role === 'user' && location.pathname.startsWith('/admin')) {
      // Force logout nếu user cố truy cập admin
      dispatch({ type: 'auth/logout' });
    }
  }, [location, isAuthenticated, role, dispatch]);

  if (isLoading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

   // Kiểm tra role nếu được yêu cầu
   if (requiredRole && role !== requiredRole) {
    // Redirect về trang phù hợp với role
    return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />;
  }
  return children;
};