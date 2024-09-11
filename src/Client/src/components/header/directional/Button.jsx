import React from 'react';

const DirectionalButton = ({ direction }) => {
  return (
    <button
      className="bg-black text-white font-bold py-2 px-4 rounded-full relative group"
    >
      {direction === 'back' ? '<' : '>'}
      <span className="absolute top-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-2 px-4 whitespace-nowrap">
        {direction === 'back' ? 'Quay lại' : 'Tiếp theo'}
      </span>
    </button>
  );
};

export default DirectionalButton;
