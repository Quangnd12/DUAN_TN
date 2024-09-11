import React from 'react';

const PauseIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
      />
    </svg>
  );
};

export default PauseIcon;
