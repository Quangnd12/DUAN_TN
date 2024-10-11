import React from "react";
import { Route, Navigate } from "react-router-dom";

// views
import Dashboard from "./Dashboard.js";
import Home from "./Home.js";
import Settings from "./Settings.js";
import Songs from "./song";
import AddSong from "./song/component/add";
import EditSong from "./song/component/edit";
import PreviewSong from "./song/component/preview.js";
import Artists from "./artist";
import AddArtist from "./artist/component/add"
import EditArtist from "./artist/component/edit.js";
import Albums from "./album";
import AddAlbum from "./album/component/add.js";
import EditAlbum from "./album/component/edit.js";

const AdminRoutes = (
  <>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="home" element={<Home />} />
    <Route path="settings" element={<Settings />} />
    <Route path="song" element={<Songs />} />
    <Route path="song/add" element={<AddSong />} />
    <Route path="song/edit/:id" element={<EditSong />} />
    <Route path="song/preview/:id" element={<PreviewSong />} />
    <Route path="artist" element={<Artists />} />
    <Route path="artist/add" element={<AddArtist />} />
    <Route path="artist/edit/:id" element={<EditArtist />} />
    <Route path="album" element={<Albums />} />
    <Route path="album/add" element={<AddAlbum />} />
    <Route path="album/edit/:id" element={<EditAlbum />} />
    {/* Bạn có thể thêm các route khác ở đây */}
    <Route path="/" element={<Navigate to="dashboard" replace />} />
  </>
);

export default AdminRoutes;
