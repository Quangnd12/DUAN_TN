import React from "react";
import PlusIcon from "../Icons/PlusIcon";
import PlayIcon from "../Icons/PlayIcon";

const ContentCard = ({ img, title, artist, releaseDate }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center bg-zinc-800 p-4 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors duration-300" tabIndex={0}>
        <img src={img} alt={title} className="w-[100px] h-[100px] object-cover mr-4" />
        <div className="flex flex-col justify-between">
          <div className="text-left">
            <p className="font-semibold">{title}</p>
            <p>{artist}</p>
            <p>{releaseDate}</p>
          </div>
          <div className="flex space-x-6 mt-2">
            <PlusIcon className="h-6 w-6 cursor-pointer hover:scale-110 transition-transform duration-200" />
            <PlayIcon className="text-white h-6 w-6 cursor-pointer hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
