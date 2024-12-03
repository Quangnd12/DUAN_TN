import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ArtistAuthForm from "../view/artistAuth/artistAuthForm";
import ForgotPassword from "../view/artistAuth/forgot";
import ResetPassword from "../view/artistAuth/resetPass";
import ArtistDashboard from "../view/dashboard/Dashboard";

const Artist = () => {
  const { isAuthenticated } = useSelector((state) => state.artistAuth);

  return (
    <div>
      <Routes>
        <Route
          path="auth/*"
          element={
            isAuthenticated ? (
              <Navigate to="/artist-portal/dashboard" />
            ) : (
              <ArtistAuthForm />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="dashboard"
          element={
            isAuthenticated ? (
              <ArtistDashboard />
            ) : (
              <Navigate to="/artist-portal/auth" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default Artist;
