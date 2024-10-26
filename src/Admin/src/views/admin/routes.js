import React from "react";
import { Route, Navigate } from "react-router-dom";

// views
import Dashboard from "./Dashboard.js";
import Home from "./Home.js";
import Settings from "./Settings.js";
import Info from "./info/index.js";
import Songs from "./song";
import Users from "./user";
import AddSong from "./song/component/add";
import EditSong from "./song/component/edit";
import PreviewSong from "./song/component/preview.js";
import Artists from "./artist";
import AddArtist from "./artist/component/add";
import EditArtist from "./artist/component/edit.js";
import Albums from "./album";
import AddAlbum from "./album/component/add.js";
import EditAlbum from "./album/component/edit.js";
import Favorites from "./favorite";
import NotFound from "./notfound/index.js";
import UnderDevelopment from "./underdev/index.js";
import Login from "../auth/Login.js";
import AddGenre from "./genre/component/add.js";
import EditGenre from "./genre/component/edit.js";
import Follows from "./follow";
import Genres from "./genre";

const AdminRoutes = (
  <>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="home" element={<Home />} />
    <Route path="settings" element={<Settings />} />
    <Route path="info/:id" element={<Info />} />
    <Route path="user" element={<Users />} />
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
    <Route path="favorite" element={<Favorites />} />
    <Route path="follow" element={<Follows />} />
    <Route path="genre" element={<Genres />} />
    <Route path="genre/add" element={<AddGenre />} />
    <Route path="genre/edit/:id" element={<EditGenre />} />
    {/* Thêm routes mới cho các trang đang phát triển */}

    <Route path="playlist" element={<UnderDevelopment />} />
    <Route path="explore" element={<UnderDevelopment />} />
    <Route path="trending" element={<UnderDevelopment />} />
    <Route path="new-releases" element={<UnderDevelopment />} />
    <Route path="analytics" element={<UnderDevelopment />} />
    <Route path="insights" element={<UnderDevelopment />} />
    <Route path="report" element={<UnderDevelopment />} />
    <Route path="profile" element={<UnderDevelopment />} />

    {/* Route mới cho trang đăng nhập */}
    <Route path="login" element={<Login />} />

    <Route path="*" element={<NotFound />} />

    {/* Bạn có thể thêm các route khác ở đây */}
    <Route path="/" element={<Navigate to="dashboard" replace />} />
  </>
);

export default AdminRoutes;
