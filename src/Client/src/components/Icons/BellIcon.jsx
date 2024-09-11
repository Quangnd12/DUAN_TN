// BellIcon.jsx
import React from 'react';

const BellIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-10 h-10 ${className}`}
      fill="white"
      viewBox="0 0 20 20"
      stroke="white"
    >
      <path
        d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707l-.707-.707V8a6 6 0 00-6-6z"
      />
      <path
        d="M5 16h10a2 2 0 01-1.723 1.961C12.577 18.603 11.327 19 10 19c-1.327 0-2.577-.397-3.277-1.039A2 2 0 015 16z"
      />
    </svg>
  );
};

export default BellIcon;
