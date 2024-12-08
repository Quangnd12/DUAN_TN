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

  const handleVolumeIconClick = () => {
    onVolumeChange({ target: { value: volume === 0 ? 0.5 : 0 } });
  };

  const handlePipClick = async () => {
    try {
      if (!document.pictureInPictureEnabled) {
        console.error('Picture-in-Picture is not supported');
        return;
      }

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      if (audio && audio.current) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 300;

        const pipVideo = document.createElement('video');
        pipVideo.width = canvas.width;
        pipVideo.height = canvas.height;
        pipVideo.muted = true;
        
        const stream = canvas.captureStream();
        pipVideo.srcObject = stream;

        const drawInfo = () => {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '20px Arial';
          ctx.fillText(title || 'Now Playing', 20, 40);
          
          ctx.font = '16px Arial';
          ctx.fillText(artist || '', 20, 70);

          const img = new Image();
          img.crossOrigin = "anonymous"; // Bắt buộc để tránh lỗi CORS
          img.src = image; // URL của ảnh
          img.onload = () => {
            ctx.drawImage(img, (canvas.width - 200) / 2, 80, 200, 200);
          };
          img.onerror = () => {
            console.error("Failed to load image due to CORS");
          };
          
        };

        drawInfo();

        const updateInterval = setInterval(drawInfo, 100);

        pipVideo.addEventListener('leavepictureinpicture', () => {
          clearInterval(updateInterval);
          pipVideo.srcObject = null;
          stream.getTracks().forEach(track => track.stop());
        });

        await pipVideo.play();
        await pipVideo.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to start PiP:', error);
    }
  };

  return (
    <div className="volume-container">
      <MdPictureInPictureAlt
        className="icon-QueueMusic mr-4"
        title="Picture in Picture"
        onClick={handlePipClick}
      />
      <FaMicrophoneAlt
        className="icon-microphone mr-4 text-white"
        title="Mic Karaoke"
        onClick={() => {
          handleLyricsClick();
          if (is_premium === 1 && !user_id) {
            navigate('/upgrade');
          } else {
            toggleLyricsDrawer(true)();
          }
        }}
      />

      {volume === 0 ? (
        <FaVolumeMute className="icon" onClick={handleVolumeIconClick} />
      ) : (
        <FaVolumeUp className="icon" onClick={handleVolumeIconClick} />
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
