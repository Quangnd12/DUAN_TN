// PlusIcon.jsx
import React, { useState } from 'react';
import CheckIcon from './CheckIcon'; // Import CheckIcon component

const PlusIcon = ({ className }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked); // Toggle clicked state
  };

  return (
    <div onClick={handleClick}>
      {clicked ? (
        <CheckIcon className={`w-6 h-6 cursor-pointer ${className} text-green-500`} />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 cursor-pointer ${className} ${clicked ? 'text-green-500' : 'text-white'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-6-6h12" />
        </svg>
      )}
    </div>
  );
};

export default PlusIcon;
