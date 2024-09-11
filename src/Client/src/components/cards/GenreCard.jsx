import React from "react";

const GenreCard = ({ genre }) => {
  return (
    <div
      key={genre.name}
      className={`${genre.color} text-white w-full h-48 cursor-pointer rounded-lg text-left relative p-4 overflow-hidden`}
    >
      <img
        src={`../assets/img/${genre.coverArt}`}
        alt={genre.name}
        className="absolute w-48 h-full object-cover shadow-2xl transform rotate-12 -right-8 -bottom-8"
      />
      <span className="relative text-lg font-bold">{genre.name}</span>
    </div>
  );
};

export default GenreCard;
