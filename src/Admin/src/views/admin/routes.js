import React from "react";
import { Route, Navigate } from "react-router-dom";

// views
import Dashboard from "./Dashboard.js";
import Home from "./Home.js";
import Settings from "./Settings.js";
import Info from "./info/index.js";
import Songs from "./song";
import AddSong from "./song/component/add"; 
import EditSong from "./song/component/edit"; 
import PreviewSong from "./song/component/preview.js";
import Artists from "./artist";
// Bạn có thể import thêm các trang khác ở đây

const AdminRoutes = (
  <>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="home" element={<Home />} />
    <Route path="settings" element={<Settings />} />
    <Route path="info" element={<Info />} />
    <Route path="song" element={<Songs />} />
    <Route path="song/add" element={<AddSong />} />
    <Route path="song/edit/:id" element={<EditSong />} />
    <Route path="song/preview/:id" element={<PreviewSong />} />
    <Route path="artist" element={<Artists />} />
    {/* Bạn có thể thêm các route khác ở đây */}
    <Route path="/" element={<Navigate to="dashboard" replace />} />
  </>
);

export default AdminRoutes;
