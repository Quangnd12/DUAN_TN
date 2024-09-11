import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import SideBar from './components/sidebar/SideBar.component';
import HomePage from './pages/homepage/HomePage';
import Header from './components/header/Header';
import SearchPage from './pages/searchpage/SearchPage';
import Artist from './pages/artist/Artist';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPass from './pages/auth/forgotPass';
import Track from "./pages/track/Track";
import Content from './pages/content/Content';
import InfoClient from './pages/info-client/Info-client';


function Client() {
  return (
    <div className="App max-h-dvh bg-black ">
      <div className='flex gap-2'>
        <div style={{ width: "300px" }}>
          <SideBar />
        </div>
        <div className='flex-1'>
          <Header />
          <div className='overflow-y-auto scrollbar-custom ' style={{  height: "620px" }}>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/artist' element={<Artist />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot' element={<ForgotPass />} />
              <Route path='/content' element={<Content />} />
              <Route path='/info' element={<InfoClient />} />
              <Route path='/track' element={<Track />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Client;
