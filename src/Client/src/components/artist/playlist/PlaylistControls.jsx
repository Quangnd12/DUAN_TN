import React, { useState } from "react";
import OptionsDropdown from "./OptionsDropdown";

const PlaylistControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionFollowClick = () => {
    setIsFollowing(!isFollowing);
    setShowOptions(false);
  };

  return (
    <div className="flex justify-start items-center space-x-7 mb-4">
      <button
        onClick={togglePlayPause}
        className="bg-green-500 text-white p-5 rounded-full"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm7 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.018 14L14.41 9.894a1 1 0 000-1.788L4.018 4A1 1 0 003 5v10a1 1 0 001.018 1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <button
        onClick={toggleFollow}
        className="text-white p-2 rounded-full border border-white ml-4"
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
      <div className="relative bottom-2 w-72">
        <button
          className="text-white p-2 rounded-full text-4xl ml-4"
          onClick={handleOptionsClick}
        >
          ...
        </button>
        {showOptions && (
          <OptionsDropdown
            handleOptionFollowClick={handleOptionFollowClick}
            isFollowing={isFollowing}
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistControls;
