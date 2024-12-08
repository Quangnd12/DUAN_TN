import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import {
  FaPlay,
  FaPause,
  FaTimes,
} from "react-icons/fa";
import data from "../../data/fetchSongData";
import { usePip } from "../../utils/pip";
import { PlayerContext } from "../context/MusicPlayer";

const PictureInPicturePlayer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { isPipOpen, togglePip, position, updatePosition } = usePip();
  const playerRef = useRef(null);

  // Lấy thông tin bài hát từ localStorage
  const getCurrentSongInfo = () => {
    const songInfo = localStorage.getItem('currentSongInfo');
    return songInfo ? JSON.parse(songInfo) : null;
  };

  const [currentSong, setCurrentSong] = useState(getCurrentSongInfo());

  // Cập nhật thông tin bài hát khi có thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentSong(getCurrentSongInfo());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        updatePosition({
          x: Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 300)),
          y: Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 200))
        });
      }
    },
    [isDragging, offset, updatePosition]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  // Xử lý phát/dừng nhạc qua postMessage
  const handlePlayPause = () => {
    window.postMessage({ type: 'TOGGLE_PLAY' }, '*');
  };

  if (!isPipOpen || !currentSong) return null;

  return (
    <div
      ref={playerRef}
      className="fixed w-72 p-8 bg-gradient-to-r from-gray-800 via-gray-900 to-slate-800 text-white rounded-lg shadow-2xl"
      style={{
        zIndex: 9999,
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        <img
          src={currentSong.image}
          alt={currentSong.title}
          className="w-full h-auto object-cover mb-2 rounded-lg shadow-md"
        />
        <h3 className="text-lg font-semibold truncate">{currentSong.title}</h3>
        <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
      </div>
      <button
        onClick={togglePip}
        className="absolute top-1 right-0 text-gray-400 hover:text-white p-2"
      >
        <FaTimes />
      </button>
      <div className="flex justify-between items-center mt-4">
        <button onClick={handlePlayPause} className="text-white hover:text-blue-500">
          {currentSong.isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
};

export default PictureInPicturePlayer;
