import React, { useState } from 'react';
import '../../assets/css/artist/volume.css'; 
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { MdQueueMusic, MdPictureInPictureAlt } from 'react-icons/md'; 
import MusicListDrawer from '../aside/MusicListDrawer';
import { usePip } from '../../../../redux/pip';

const Volume = ({ volume, onVolumeChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { togglePip } = usePip();

  const handleVolumeChange = (e) => {
    onVolumeChange(e);
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
    </div>
  );
};

export default Volume;