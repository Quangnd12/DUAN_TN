import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaTimes,
} from "react-icons/fa";
import data from "../../pages/artist/utils/fetchSongData";
import { usePip } from "../../../../redux/pip";

const PictureInPicturePlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isPipOpen, togglePip, position, updatePosition } = usePip();
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const currentSong = data.songs[currentSongIndex];

  const playerRef = useRef(null); // Ref cho thành phần player

  // Xử lý phát/dừng nhạc
  const handlePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % data.songs.length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + data.songs.length) % data.songs.length
    );
  };

  const handleMouseDown = (e) => {
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
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
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
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  if (!isPipOpen) return null;

  return (
    <div
      ref={playerRef}
      className="fixed w-72 p-8 bg-gradient-to-r from-gray-800 via-gray-900 to-slate-800 text-white rounded-lg shadow-2xl transition-transform duration-500 ease-in-out transform"
      style={{
        zIndex: 1000,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        <img
          src={currentSong.image}
          alt={currentSong.name}
          className="w-full h-auto object-cover mb-2 rounded-lg shadow-md"
        />
        <h3 className="text-lg font-semibold truncate">{currentSong.name}</h3>
        <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
      </div>
      {/* Nút đóng PIP */}
      <button
        onClick={togglePip}
        className="absolute top-1 right-0  text-gray-400 text-2xl hover:text-white p-1 transition-colors duration-300"
      >
        <FaTimes />
      </button>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded-b-lg">
        <button
          onClick={handlePrevious}
          className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-125"
        >
          <FaStepBackward />
        </button>
        <button
          onClick={handlePlay}
          className={`text-white bg-blue-600 rounded-full p-2 transition-transform duration-300 hover:scale-110 hover:bg-blue-700 ${
            isPlaying ? "animate-pulse" : ""
          }`}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={handleNext}
          className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-125"
        >
          <FaStepForward />
        </button>
      </div>
    </div>
  );
};

export default PictureInPicturePlayer;
