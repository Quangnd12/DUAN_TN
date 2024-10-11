import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ResetPass from "./pages/auth/resetPass";
import Content from "./pages/content/Content";
import InfoClient from "./pages/info-client/Info-client";
import TopRank from "./pages/toprank/TopRank";
import TopChart from "./pages/topchart/sections/chart";
import Library from "./pages/library/library";
import AllSong from './pages/artist/components/SongList';
import AllAlbums from './pages/artist/components/AllAlbum';
import Albums from './pages/album';
import Genres from "./pages/genre";
import AllGenre from "./pages/genre/GenreList";
import Playlist from "./pages/playlist";
import PictureInPicturePlayer from "./components/pip";
import Lyrics from "./pages/lyrics/lyrics";
import NotFound from "./pages/notfound/index";
import Report from "./pages/report/Report";
import Event from "./pages/event/Event";
import EventDetail from "./pages/event/Detail-event/Detail-event";




import PlaylistAll from "./pages/playlist/components/PlaylistAll";
import AddPlaylist from "./pages/playlist/components/PlaylistAdd";
import EmptyLayout from "./layouts";
import LayoutArtist from "./pages/showAll/artists";
import LayoutAlbums from "./pages/showAll/albums";
import LayoutRadio from "./pages/showAll/radios";
import AllTopranks from "./pages/artist/components/ToprankList";

function MainLayout({ children }) {
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
    <div className="flex gap-2">
      <div>{!isMobile && <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}</div>
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-0' : 'ml-16'} transition-all duration-300`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="overflow-y-auto scrollbar-custom" style={{ height: "620px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AuthRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("user");
  const location = useLocation();
  
  if (isAuthenticated) {
    // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
}

function Client() {
  
  return (
    <PipProvider>
      <div className="App max-h-dvh bg-black">
        <MainLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path='/artist' element={<EmptyLayout />}>
                  <Route path=':artistName' element={<Artist />} />
                  <Route path=":artistName/album" element={<AllAlbums />} />
                  <Route path=":artistName/song" element={<AllSong />} />
                </Route>
            <Route path='/allsong' element={<AllSong />} /><Route path='/show-all' element={<EmptyLayout />} >
                  <Route path="artist" element={<LayoutArtist />} />
                  <Route path="album" element={<LayoutAlbums />} />
                
                   <Route path="radio" element={<LayoutRadio />} />
                </Route>
            <Route path='/album/:albumName' element={<Albums />} />
            <Route path='/listalbum/:id' element={<Albums />} />
            <Route path="/toprank" element={<AllTopranks />} />
            <Route path="/toprank/:id" element={<TopRank />} />
            <Route path='/lyrics' element={<Lyrics />} />
            <Route path='/genre' element={<AllGenre />} />
            <Route path='/track' element={<Genres />} />

            {/* Auth routes - protected from logged-in users */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/forgot" element={<AuthRoute><ForgotPass /></AuthRoute>} />
            <Route path="/reset-password/:token" element={<AuthRoute><ResetPass /></AuthRoute>} />

            {/* Private routes */}
            <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
            <Route path="/playlist/:id" element={<PrivateRoute><Playlist /></PrivateRoute>} />
            <Route path="/playlist" element={<PrivateRoute><EmptyLayout /></PrivateRoute>}>
                  <Route path=":playlistName" element={<PrivateRoute><Playlist /> </PrivateRoute>} />
                  <Route path="add" element={<PrivateRoute><AddPlaylist /></PrivateRoute>} />
                  <Route path="all" element={<PrivateRoute><PlaylistAll /></PrivateRoute>} />
                </Route>
            <Route path="/info/:userId" element={<PrivateRoute><InfoClient /></PrivateRoute>} />
            <Route path="/content" element={<PrivateRoute><Content /></PrivateRoute>} />
            <Route path='/report' element={<PrivateRoute><Report /></PrivateRoute>} />
            <Route path='/event' element={<PrivateRoute><Event /></PrivateRoute>} />
            <Route path='/event/:id' element={<PrivateRoute><EventDetail /></PrivateRoute>} />

            {/* NotFound route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
        <PictureInPicturePlayer />
      </div>
    </PipProvider>
  );
}

export default Client;