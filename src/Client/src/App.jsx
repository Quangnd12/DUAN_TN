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
import Library from "./pages/library/library";
import AllSong from './pages/artist/components/SongList';
import AllAlbums from './pages/artist/components/AlbumList';
import Albums from './pages/album';
import Playlist from "./pages/playlist";
import PictureInPicturePlayer from "./components/pip";
import Lyrics from "./pages/lyrics/lyrics";
import NotFound from "./pages/notfound/index";

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
            <Route path='/artist/:id' element={<Artist />} />
            <Route path='/allsong' element={<AllSong />} />
            <Route path='/allalbum' element={<AllAlbums />} />
            <Route path='/listalbum/:id' element={<Albums />} />
            <Route path="/toprank" element={<TopRank />} />
            <Route path='/lyrics' element={<Lyrics />} />

            {/* Auth routes - protected from logged-in users */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/forgot" element={<AuthRoute><ForgotPass /></AuthRoute>} />
            <Route path="/reset-password/:token" element={<AuthRoute><ResetPass /></AuthRoute>} />

            {/* Private routes */}
            <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
            <Route path="/playlist/:id" element={<PrivateRoute><Playlist /></PrivateRoute>} />
            <Route path="/info/:userId" element={<PrivateRoute><InfoClient /></PrivateRoute>} />
            <Route path="/content" element={<PrivateRoute><Content /></PrivateRoute>} />

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