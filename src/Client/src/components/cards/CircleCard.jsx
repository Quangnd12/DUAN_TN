import React, { useState } from "react";
import { Link } from "react-router-dom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const CircleCard = ({ image, name, title }) => {
  const greenColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--green-color")
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
      className="hover:bg-gray-500 cursor-pointer transition-all rounded-md p-2 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-100">
        <Link to={"/artist"}>
          <div className="w-100" style={{ width: "150px", height: "150px" }}>
            <img
              className="rounded-full overflow-hidden"
              style={{ width: "100%", height: "100%" }}
              src={image}
              alt={name}
            />
          </div>
        </Link>
        <div>
          {(isHovered || isPlaying) && (
             isPlaying ? (
              <PauseCircleIcon
                className="absolute top-1/2  left-3/4 transform: translate-x-1/2 -translate-y-1/2 z-10"
                fontSize="large"
                sx={{ color: greenColor }}
                onClick={handleIconClick}
              />
            ) : (
              <PlayCircleIcon
                className="absolute top-1/2  left-3/4  transform: translate-x-1/2 -translate-y-1/2 z-10 ;"
                fontSize="large"
                sx={{ color: greenColor }}
                onClick={handleIconClick}
              />
            ))}
        </div>
      </div>
      <div className="text-center text-white font-bold truncate overflow-hidden whitespace-nowrap">
        {name}
      </div>
      <div className="text-center text-white">{title}</div>
    </div>
  );
};

export default CircleCard;
