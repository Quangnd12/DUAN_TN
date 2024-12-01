import React, { useState, useContext } from "react";
import "../../assets/css/artist/volume.css";
import { FaVolumeUp, FaVolumeMute, FaMicrophoneAlt } from "react-icons/fa";
import { MdQueueMusic, MdPictureInPictureAlt } from "react-icons/md";
import MusicListDrawer from "../aside/MusicListDrawer";
import { usePip } from "../../utils/pip";
import Drawer from "@mui/material/Drawer";
import Lyrics from "../../pages/lyrics/lyrics";
import { PlayerContext } from "../context/MusicPlayer";
import { useNavigate } from "react-router-dom";

const Volume = ({ volume, onVolumeChange, lyrics, title, artist, album, image, playCount, audio, currentTime, TotalDuration, user_id, isPlaying }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const { togglePip } = usePip();
  const { playerState } = useContext(PlayerContext);
  const { is_premium } = playerState;
  const navigate = useNavigate();
  const [showLyrics, setShowLyrics] = useState(false);
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);

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

  const handleLyricsClick = () => {
    if (is_premium === 1) {
      if (user_id) {
        setIsLyricsModalOpen(true);
      } else {
        navigate('/upgrade');
      }
    } else {
      setIsLyricsModalOpen(true);
    }
  };

  return (
    <div className="volume-container">
      <MdPictureInPictureAlt
        className="icon-QueueMusic mr-4"
        title="Restore"
        onClick={togglePip}
      />
      <FaMicrophoneAlt
        className="icon-microphone mr-4 text-white"
        title="Mic Karaoke"
        onClick={handleLyricsClick}
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
      <MdQueueMusic
        className="icon ml-4"
        title="Music List"
        onClick={handleDrawerOpen}
      />
      <MusicListDrawer open={drawerOpen} onClose={handleDrawerClose} />

      {isLyricsModalOpen && (
        <Drawer
          anchor="bottom"
          open={isLyricsModalOpen}
          onClose={() => setIsLyricsModalOpen(false)}
        >
          <Lyrics
            onClose={() => setIsLyricsModalOpen(false)}
            lyrics={lyrics}
            title={title}
            artist={artist}
            album={album}
            image={image}
            playCount={playCount}
            audioElement={audio}
            currentTime={currentTime}
            TotalDuration={TotalDuration}
            isPlaying={isPlaying}
          />
        </Drawer>
      )}
    </div>
  );
};

export default Volume;
