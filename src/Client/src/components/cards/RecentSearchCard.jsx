import React, { useState } from "react";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const RecentSearchCard = ({ item, index, handleRemove }) => {
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
        <Link to="/artist">
          <img
            src={`images/${item.image}`}
            alt={item.name}
            className={`w-44 h-44 mb-2 ${
              item.role === "Artist" ? "rounded-full" : "rounded-md"
            }`}
          />
        </Link>

        <div
          className=" absolute top-2/3 right-0 cursor-pointer transition-all rounded-md p-2 "
        >
          {(isHovered || isPlaying) &&
            (isPlaying ? (
              <PauseCircleIcon
                className="transform: translate-x-1/2 -translate-y-1/2 z-10"
                fontSize="large"
                sx={{ color: sky }}
                onClick={handleIconClick}
              />
            ) : (
              <PlayCircleIcon
                className="transform: translate-x-1/2 -translate-y-1/2 z-10 ;"
                fontSize="large"
                sx={{ color: sky }}
                onClick={handleIconClick}
              />
            ))}
        </div>
      </div>
      <div className="text-white">{item.name}</div>
      <div className="text-gray-400 text-sm">{item.role}</div>
    </div>
  );
};

export default RecentSearchCard;
