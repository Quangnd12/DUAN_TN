import React, { useState } from 'react';
import '../../assets/css/artist/volume.css'; 
import { FaVolumeUp, FaVolumeMute, FaMicrophoneAlt} from 'react-icons/fa'; // Thay FaMicrophoneAlt bằng FaMicrophone
import { MdQueueMusic, MdPictureInPictureAlt } from 'react-icons/md';
import Drawer from '@mui/material/Drawer';
import Lyrics from '../../pages/lyrics/lyrics';

const Volume = ({ volume, onVolumeChange }) => {
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  const handleVolumeChange = (e) => {
      onVolumeChange(e);
  };

  const toggleLyricsDrawer = (open) => () => {
      setIsLyricsOpen(open);
  };

  return (
    <div className="volume-container">
      <FaMicrophoneAlt // Sử dụng FaMicrophone thay cho FaMicrophoneAlt
        className="icon-microphone mr-4" 
        title="Mic Karaoke" // Đổi title thành Mic Karaoke
        onClick={toggleLyricsDrawer(true)} // Mở Drawer khi click
      />
      <MdPictureInPictureAlt className="icon-QueueMusic mr-4" title="Restore" />
      
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
      <MdQueueMusic className="icon ml-4" title="Music List" />

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
