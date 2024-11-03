import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../../redux/slice/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading && auth.token) {
      dispatch(checkAuth());
    }
  }, [dispatch, auth.isAuthenticated, auth.isLoading, auth.token]);

  return auth;
};