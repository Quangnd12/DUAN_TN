import React from "react";
import { Link } from "react-router-dom";

const GenreCard = ({ genre }) => {
  return (
    <Link to={`/track/${genre.id}`}>
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
    </Link>
  );
};

export default GenreCard;