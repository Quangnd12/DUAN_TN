import React from "react";
import { Route, Navigate } from "react-router-dom";

// views
import Dashboard from "./Dashboard.js";
import Home from "./Home.js";
import Info from "./info/index.js";
import PlaylistDetail from "./info/components/userplaylistDetail.js";
import Songs from "./song";
import Users from "./user";
import Events from "./event"
import EventAdd from "./event/component/add.js"
import EventEdit from "./event/component/edit.js"
import EventDetail from "./event/component/detail.js"
import AddSong from "./song/component/add";
import EditSong from "./song/component/edit";
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
import Countries from "./country/index.js";
import AddCountry from "./country/component/add.js";
import EditCountry from "./country/component/edit.js";
import ShowAllEvents from "./showAllEvent.js";


const AdminRoutes = (
  <>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="home" element={<Home />} />
    <Route path="info/:id" element={<Info />} />
    <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
    <Route path="user" element={<Users />} />
    <Route path="song" element={<Songs />} />
    <Route path="song/add" element={<AddSong />} />
    <Route path="song/edit/:id" element={<EditSong />} />
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
    <Route path="event" element={<Events />} />
    <Route path="event/add" element={<EventAdd />} />
    <Route path="event/edit/:id" element={<EventEdit />} />
    <Route path="event/detail/:id" element={<EventDetail />} />
    <Route path="event/show-all" element={<ShowAllEvents />} />
    {/* Thêm routes mới cho các trang đang phát triển */}

    <Route path="playlist" element={<UnderDevelopment />} />
    <Route path="explore" element={<UnderDevelopment />} />
    <Route path="countries" element={<Countries />} />
    <Route path="countries/add" element={<AddCountry />} />
    <Route path="countries/edit/:id" element={<EditCountry />} />
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
