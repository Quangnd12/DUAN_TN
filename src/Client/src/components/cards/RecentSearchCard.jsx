import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const RecentSearchCard = ({ item, index, handleRemove }) => {
  const navigate = useNavigate();
  const sky = getComputedStyle(document.documentElement)
    .getPropertyValue("--sky")
    .trim();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleArtistClick = () => {
    navigate(`/artist/${item.name}`);
  };

  return (
    <div
      key={index}
      className="relative flex-shrink-0 text-center group hover:bg-gray-500 px-7 rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="relative top-5 left-24 bg-gray-950 text-white rounded-full w-8 h-8 m-2"
        onClick={() => handleRemove(index)}
      >
        <ClearIcon />
      </button>
      <div className="w-100 relative">
        <div onClick={handleArtistClick} className="cursor-pointer">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-44 h-44 mb-2 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="text-white cursor-pointer" onClick={handleArtistClick}>
        {item.name}
      </div>
      <div className="text-gray-400 text-sm">
        {item.role === 1 ? "Artist" : "Singer"}
      </div>
    </div>
  );
};

export default RecentSearchCard;
