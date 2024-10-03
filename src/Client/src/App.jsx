import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { PipProvider } from "../../redux/pip";
import SideBar from "./components/sidebar/SideBar.component";
import HomePage from "./pages/homepage/HomePage";
import Header from "./components/header/Header";
import SearchPage from "./pages/searchpage/SearchPage";
import Artist from "./pages/artist/";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPass from "./pages/auth/forgotPass";
import Content from "./pages/content/Content";
import InfoClient from "./pages/info-client/Info-client";
import TopRank from "./pages/toprank/TopRank";
import Library from "./pages/library/library";
import AllSong from './pages/artist/components/SongList';
import AllAlbums from './pages/artist/components/AllAlbum';
import Albums from './pages/album';
import Playlist from "./pages/playlist";
import PictureInPicturePlayer from "./components/pip";
import PlaylistAll from "./pages/playlist/components/PlaylistAll";
import AddPlaylist from "./pages/playlist/components/PlaylistAdd";
import EmptyLayout from "./layouts";
import LayoutArtist from "./pages/showAll/artists";
import LayoutAlbums from "./pages/showAll/albums";
import LayoutRadio from "./pages/showAll/radios";

function Client() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setIsSidebarOpen(!newIsMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <PipProvider>
      <div className="App max-h-dvh bg-black ">
        <div className="flex gap-2">
          <div>{!isMobile && <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}</div>
          <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-0' : 'ml-16'} transition-all duration-300`}>
            <Header toggleSidebar={toggleSidebar} />
            <div
              className="overflow-y-auto scrollbar-custom "
              style={{ height: "620px" }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path='/artist' element={<EmptyLayout />}>
                  <Route path=':artistName' element={<Artist />} />
                  <Route path=":artistName/album" element={<AllAlbums />} />
                  <Route path=":artistName/song" element={<AllSong />} />
                </Route>
                <Route path='/show-all' element={<EmptyLayout />} >
                  <Route path="artist" element={<LayoutArtist />} />
                  <Route path="album" element={<LayoutAlbums />} />
                
                   <Route path="radio" element={<LayoutRadio />} />
                </Route>
                <Route path='/album/:albumName' element={<Albums />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPass />} />
                <Route path="/content" element={<Content />} />
                <Route path="/info" element={<InfoClient />} />
                <Route path="/playlist" element={<EmptyLayout />}>
                  <Route path=":playlistName" element={<Playlist />} />
                  <Route path="add" element={<AddPlaylist />} />
                  <Route path="all" element={<PlaylistAll />} />
                </Route>
                <Route path="/toprank" element={<TopRank />} />
                <Route path="/library" element={<Library />} />
              </Routes>
            </div>
          </div>
        </div>
        <PictureInPicturePlayer />
      </div>
    </PipProvider>
  );
}

export default Client;