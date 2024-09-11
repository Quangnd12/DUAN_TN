import React from "react";
import { Link } from "react-router-dom";

const RecentSearchCard = ({ item, index, handleRemove }) => {
  return (
    <div
      key={index}
      className="relative flex-shrink-0 text-center group hover:bg-gray-500 px-7 rounded-lg"
    >
      <button
        className="relative top-5 left-24 bg-gray-950 text-white rounded-full w-8 h-8 m-2"
        onClick={() => handleRemove(index)}
      >
        X
      </button>
      <div className="relative">
        <Link to="/artist">
          <img
            src={`../assets/img/${item.image}`}
            alt={item.name}
            className={`w-44 h-44 mb-2 ${
              item.role === "Artist" ? "rounded-full" : "rounded-md"
            }`}
          />
          <div className="absolute bottom-5 left-36 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-green-500 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.5 5.5a1 1 0 011.54-.84l7 4.5a1 1 0 010 1.68l-7 4.5A1 1 0 016.5 15.5v-9z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      <div className="text-white">{item.name}</div>
      <div className="text-gray-400 text-sm">{item.role}</div>
    </div>
  );
};

export default RecentSearchCard;
