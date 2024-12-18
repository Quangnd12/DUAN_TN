import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PipProvider } from "./utils/pip";
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
import PlaylistPublicInfo from "./components/searchResults/Tabs/PlaylistPublic";
import Mix from "./pages/mix/MixList";

import MixDetail from "./pages/mix/MixDetail";
import CreateMix from "./pages/mix/CreateMix";
import AddPlaylist from "./pages/playlist/components/PlaylistAdd";
import PlaylistList from "./pages/playlist/sections/playlist";
import PlaylistListPublic from "./components/searchResults/Tabs";
import PlayListInfo from "./pages/playlist/components/PlaylistInfo";
import EmptyLayout from "./layouts";
import LayoutArtist from "./pages/showAll/artists";
import LayoutAlbums from "./pages/showAll/albums";
import LayoutRadio from "./pages/showAll/radios";
import AllTopranks from "./pages/artist/components/ToprankList";
import { PlayerContext, PlayerProvider } from "./components/context/MusicPlayer";
import PlayerControls from "./components/audio/PlayerControls";
import PaymentPage from "./pages/payment";
import PricingPlans from "./pages/payment/components/plan";
import { getPaymentByUser } from "services/payment";
import { ThemeProvider } from './utils/ThemeContext';


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
    <ThemeProvider>
      <div className="flex gap-2">
        <div>{!isMobile && <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}</div>
        <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-0' : 'ml-16'} transition-all duration-300`}>
          <Header toggleSidebar={toggleSidebar} />
        <div className="overflow-y-auto scrollbar-custom" style={{ height: "calc(100vh - 190px)" }}>
          {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
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

  const [savedSongs, setSavedSongs] = useState([]);
  const [payment, setPayments] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const songs = JSON.parse(localStorage.getItem("songs") || "[]");
    setSavedSongs(songs);
  }, []);

  const getPayment = async () => {
    try {
      if (user) {
        const data = await getPaymentByUser();
        setPayments(data || []);
      }
    } catch (error) {
      console.error("Error fetching payment data", error);
      setPayments([]);
    }
  };

  useEffect(() => {
    if (user) {
      getPayment();
    }
  }, [user]);

  return (
    <PipProvider>
      <div className="App max-h-dvh bg-black">
        <MainLayout>
          <PlayerProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/playlistpulic/:id" element={<PlaylistListPublic />} />
              < Route path='/artist' element={<EmptyLayout />}>
                <Route path=':artistName' element={<Artist />} />
                <Route path=":artistName/album" element={<AllAlbums />} />
                <Route path=":artistName/song" element={<AllSong />} />
              </Route>
              <Route path='/allsong' element={<AllSong />} /><Route path='/show-all' element={<EmptyLayout />} >
                <Route path="artist" element={<LayoutArtist />} />
                <Route path="album" element={<LayoutAlbums />} />
                <Route path="radio" element={<LayoutRadio />} />
              </Route>
              <Route path='/album/:id' element={<Albums />} />
              <Route path='/listalbum/:id' element={<Albums />} />
              <Route path="/toprank" element={<AllTopranks />} />
              <Route path="/toprank/:id" element={<TopRank />} />
              <Route path='/lyrics' element={<Lyrics />} />
              <Route path='/genre' element={<AllGenre />} />
              <Route path='/track/:id' element={<Genres />} />

              {/* Auth routes - protected from logged-in users */}
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
              <Route path="/forgot" element={<AuthRoute><ForgotPass /></AuthRoute>} />
              <Route path="/reset-password/:token" element={<AuthRoute><ResetPass /></AuthRoute>} />

              {/* Private routes */}
              <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
              <Route path="/mixes" element={<PrivateRoute><Mix /></PrivateRoute>} />
              <Route path="mixes/mixDetail/:id" element={<PrivateRoute><MixDetail /></PrivateRoute>} />
              <Route path="mixes/add" element={<PrivateRoute><CreateMix /></PrivateRoute>} />
              <Route path="/playlistall" element={<PrivateRoute><Playlist /></PrivateRoute>} />
              <Route path="/playlist" element={<PrivateRoute><EmptyLayout /></PrivateRoute>}>
                <Route path="playlistdetail/:name" element={<PrivateRoute><PlaylistList /></PrivateRoute>} />
                <Route path="add" element={<PrivateRoute><AddPlaylist /></PrivateRoute>} />
                <Route path="info" element={<PrivateRoute><PlayListInfo /></PrivateRoute>} />
              </Route>
              <Route path="/info/:userId" element={<PrivateRoute><InfoClient /></PrivateRoute>} />
              <Route path="/content" element={<PrivateRoute><Content /></PrivateRoute>} />
              <Route path='/report' element={<Report />} />
              <Route path='/event' element={<PrivateRoute><Event /></PrivateRoute>} />
              <Route path='/event/:id' element={<PrivateRoute><EventDetail /></PrivateRoute>} />
              {isAuthenticated && !payment.user_id &&
                <Route path='/payment' element={<PaymentPage />} />
              }
              {payment.is_notified === 1 || !payment.user_id && (
                <Route path='/upgrade' element={<PricingPlans />} />
              )}

              <Route path="*" element={<NotFound />} />
            </Routes>
            <div style={{ marginTop: '20px' }}>
            {savedSongs.length > 0 && <PlayerControls />}
            </div>
          </PlayerProvider>
        </MainLayout>
        <PictureInPicturePlayer />
      </div>
    </PipProvider>
  );
}

export default Client;