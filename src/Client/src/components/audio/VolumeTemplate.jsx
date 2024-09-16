import React from 'react';
import '../../assets/css/artist/volume.css'; 
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { MdQueueMusic, MdPictureInPictureAlt } from 'react-icons/md'; 

const Volume = ({ volume, onVolumeChange }) => {
  const handleVolumeChange = (e) => {
    onVolumeChange(e);
  };

  return (
    <div className="volume-container">
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
    </div>
  );
};

export default Volume;
