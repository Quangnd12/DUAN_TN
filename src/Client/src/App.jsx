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
import TopChart from "./pages/topchart/sections/chart";
import Library from "./pages/library/library";
import AllSong from './pages/artist/components/SongList';
import AllAlbums from './pages/artist/components/AlbumList';
import Albums from './pages/album';
import Genres from "./pages/genre";
import AllGenre from "./pages/genre/GenreList";
import Playlist from "./pages/playlist";
import PictureInPicturePlayer from "./components/pip";
import Lyrics from "./pages/lyrics/lyrics";
import Report from "./pages/report/Report";
import Event from "./pages/event/Event";
import EventDetail from "./pages/event/Detail-event/Detail-event";





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
                <Route path='/artist/:id' element={<Artist />} />
                <Route path='/allsong' element={<AllSong />} />
                <Route path='/allalbum' element={<AllAlbums />} />
                <Route path='/listalbum/:id' element={<Albums />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<ForgotPass />} />
                <Route path="/content" element={<Content />} />
                <Route path="/info" element={<InfoClient />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="/toprank" element={<TopRank />} />
                <Route path="/library" element={<Library />} />
                <Route path='/lyrics' element={<Lyrics />} />
                <Route path='/genre' element={<AllGenre />} />
                <Route path='/track' element={<Genres />} />
                <Route path='/report' element={<Report />} />
                <Route path='/event' element={<Event />} />
                <Route path='/event/:id' element={<EventDetail />} />
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