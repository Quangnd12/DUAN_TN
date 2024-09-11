import React from "react";
import PlayIcon from "../Icons/PlayIcon";

const InfoClientCard = ({ id, title, artist, duration, imageUrl }) => {
  return (
    <li
      key={id}
      className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-zinc-700 transition-colors duration-300 group"
    >
      <div className="flex items-center">
        <span className="text-white mr-4">{id}</span>
        <div className="bg-gray-600 w-16 h-16 rounded-lg overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={imageUrl}
            alt={title} 
          />
        </div>
        <div className="ml-4">
          <span className="text-white block">{title}</span>
          <span className="text-gray-400 block">{artist}</span>
        </div>
        <div className="ml-24">
          <span className="text-gray-400 block">{title}</span>
        </div>
      </div>
      <span className="text-gray-400 block">{duration}</span>
      <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayIcon className="text-white" />
      </div>
    </li>
  );
};

export default InfoClientCard;
