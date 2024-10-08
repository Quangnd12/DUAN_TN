// CheckIcon.jsx
import React from 'react';

const CheckIcon = ({ className }) => {
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};

export default CheckIcon;
