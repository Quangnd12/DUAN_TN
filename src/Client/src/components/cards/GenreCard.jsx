import React from "react";
import { Link } from "react-router-dom";

const GenreCard = ({ genre }) => {
  // Tạo background color dựa trên country
  const getBackgroundColor = (country) => {
    switch (country) {
      case "Việt Nam":
        return "bg-red-500";
      case "US-UK":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Link to={`/track/${genre.id}`}>
      <div
        className={`${getBackgroundColor(genre.country)} text-white w-full h-48 hover:opacity-50 cursor-pointer transition-all rounded-lg text-left relative p-4 overflow-hidden`}
      >
        <img
          src={genre.image}
          alt={genre.name}
          className="absolute w-48 h-full object-cover shadow-2xl transform rotate-12 -right-8 -bottom-8"
        />
        <div className="relative z-10">
          <span className="text-lg font-bold">{genre.name}</span>
          <div className="text-sm mt-1 opacity-80">{genre.country}</div>
        </div>
      </div>
    </Link>
  );
};

export default GenreCard;
