import React from "react";

const GenreCard = ({ genre }) => {
  return (
    <div
      key={genre.id}
      className={`text-white w-full  cursor-pointer rounded-md text-left p-4 overflow-hidden relative`}
    >
      <img
        src={`${genre.image}`}
        alt={genre.name}
        className="rounded-md w-full h-full object-cover"
      />
      <span className="absolute top-[1.5rem] left-[1.7rem] text-md font-bold">{genre.name}</span>
    </div>
  );
};

export default GenreCard;