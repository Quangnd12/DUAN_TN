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

const Volume = ({ volume, onVolumeChange, lyrics, title, artist, album, image, playCount, audio, currentTime, TotalDuration }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const { togglePip } = usePip();
  const { playerState } = useContext(PlayerContext);
  const { is_premium } = playerState;
  const navigate = useNavigate();

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
        className="icon-microphone mr-4 text-white"
        title="Mic Karaoke" // Đổi title thành Mic Karaoke
        onClick={() => {
          if (is_premium) {
            toggleLyricsDrawer(false)
            navigate('/upgrade');
          } else {
            toggleLyricsDrawer(true)
          }

        }}// Mở Drawer khi click
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

      <Drawer
        anchor="bottom"
        open={isLyricsOpen && lyrics !== "Not Found!"}
        onClose={lyrics !== "Not Found!" ? toggleLyricsDrawer(false) : null}
      >
        <Lyrics
          onClose={toggleLyricsDrawer(false)}
          lyrics={lyrics}
          title={title}
          artist={artist}
          album={album}
          image={image}
          playCount={playCount}
          audioElement={audio}
          currentTime={currentTime}
          TotalDuration={TotalDuration}
        />
      </Drawer>
    </div>
  );
};

export default Volume;
