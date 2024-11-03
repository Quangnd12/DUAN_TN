// AuthProvider.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../redux/slice/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          console.error('Failed to restore auth state:', error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;