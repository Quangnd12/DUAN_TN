import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        const lastLoginTime = sessionStorage.getItem('lastLoginTime');
        const isLoggedOut = sessionStorage.getItem('isLoggedOut');
        
        if (isLoggedOut === 'true') {
          setIsAuthenticated(false);
          return;
        }

        if (accessToken && user && lastLoginTime) {
          const currentTime = Date.now();
          const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
          
          if (currentTime - parseInt(lastLoginTime) < sessionTimeout) {
            setIsAuthenticated(true);
            return;
          }
        }
        
        setIsAuthenticated(false);
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        localStorage.clear();
        sessionStorage.clear();
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Hiển thị loading state trong khi kiểm tra authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login với current location để sau khi login có thể quay lại
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;