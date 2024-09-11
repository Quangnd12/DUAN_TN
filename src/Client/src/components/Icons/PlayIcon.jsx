import React, { useState } from 'react';
import PauseIcon from './PauseIcon';

const PlayIcon = ({ className }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked); // Toggle clicked state
  };

  return (
    <div
      onClick={handleClick}
      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-white bg-white ${className}`}
    >
      {clicked ? (
        <PauseIcon className="w-4 h-4 text-black" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3l14 9-14 9V3z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
};

export default PlayIcon;
