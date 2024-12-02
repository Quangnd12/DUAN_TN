import React from "react";
import PlayIcon from "../Icons/PlayIcon";

const InfoClientCard = ({ id, title, artist, duration, imageUrl }) => {
  return (
    <li
      key={id}
      className="bg-black p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-zinc-700 transition-colors duration-300 group"
    >
      <div className="flex items-center">
        <span className="text-white mr-4">{id}</span>
        <div className="bg-gray-600 w-16 h-16 rounded-lg overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={imageUrl}
            alt={title}
            onError={(e) => e.target.src = '/images/music.png'}
          />
        </div>
        <div className="ml-4">
          <span className="text-white block">{title}</span>
          <span className="text-gray-400 block">{artist}</span>
        </div>
      </div>
      <div className="relative flex items-center ml-4 w-24">
        <span className="text-gray-400 block absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          {duration}
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayIcon className="text-white" />
        </div>
      </div>
    </li>
  );
};

export default InfoClientCard;
