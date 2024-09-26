import React, { useState } from 'react';
import '../../assets/css/artist/volume.css'; 
import { FaVolumeUp, FaVolumeMute, FaMicrophoneAlt } from 'react-icons/fa';
import { MdQueueMusic, MdPictureInPictureAlt } from 'react-icons/md'; 
import MusicListDrawer from '../aside/MusicListDrawer';
import { usePip } from '../../../../redux/pip';
import Drawer from '@mui/material/Drawer';
import Lyrics from '../../pages/lyrics/lyrics';

const Volume = ({ volume, onVolumeChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const { togglePip } = usePip();

  const handleVolumeChange = (e) => {
      onVolumeChange(e);
  };

  const toggleLyricsDrawer = (open) => () => {
      setIsLyricsOpen(open);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="volume-container">
      <MdPictureInPictureAlt 
        className="icon-QueueMusic mr-4" 
        title="Restore" 
        onClick={togglePip}
      />
      <FaMicrophoneAlt // Sử dụng FaMicrophone thay cho FaMicrophoneAlt
        className="icon-microphone mr-4" 
        title="Mic Karaoke" // Đổi title thành Mic Karaoke
        onClick={toggleLyricsDrawer(true)} // Mở Drawer khi click
      />
    
      
      {volume === 0 ? (
        <FaVolumeMute className="icon" />
      ) : (
        <FaVolumeUp className="icon" />
      )}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
      <MdQueueMusic className="icon ml-4" title="Music List" onClick={handleDrawerOpen} />
      <MusicListDrawer open={drawerOpen} onClose={handleDrawerClose} />
    

      {/* Drawer mở từ phía dưới */}
      <Drawer
        anchor="bottom"
        open={isLyricsOpen}
        onClose={toggleLyricsDrawer(false)}
      >
        {/* Nội dung Drawer là component Lyrics */}
        <Lyrics onClose={toggleLyricsDrawer(false)} />
      </Drawer>
    </div>
  );
};

export default Volume;