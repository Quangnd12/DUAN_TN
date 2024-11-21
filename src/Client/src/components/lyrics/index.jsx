import React, { useState } from 'react';

const LyricModal = ({ lyrics, onClose }) => {

if(lyrics=== "Not Found!"){
lyrics="We are updating the lyrics!"
}

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose} 
    >
      <div
        className="bg-[#1f2937] p-6 rounded-lg max-w-lg w-full relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl text-white"
          onClick={onClose} 
        >
          &times;
        </button>

        <div className="flex flex-col">
          <h2 className="text-xl text-white mb-4 font-semibold">Lyrics</h2>
          <textarea
            className="border border-gray-400 p-3 rounded-md text-white bg-[#314054] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lyrics}
            rows="10" 
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default LyricModal;
