import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Client from "./Client/src/App";
import Admin from "./Admin/src/layouts/Admin";
import Auth from "./Admin/src/layouts/Auth.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/store";
import { PlayerProvider } from "Admin/src/components/audio/playerContext";
import { ProtectedRoute } from "./redux/PrivateRoute";
import { PublicRoute } from "./utils/PublicRoute";
import { checkAuth } from "./redux/slice/authSlice";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <PlayerProvider>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Client />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PlayerProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
