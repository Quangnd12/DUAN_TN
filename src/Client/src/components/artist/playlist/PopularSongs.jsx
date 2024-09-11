import React, { useState } from "react";
import popularSongs from "../../../data/popularSongs";

const PopularSongs = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const handleDropdownClick = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4">Popular</h2>
      <div className="space-y-4">
        {popularSongs.map((item, index) => (
          <div
            key={index}
            className={`relative grid grid-cols-3 items-center p-4 rounded-lg transition duration-300 ${
              hoveredIndex === index ? "bg-gray-700" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center space-x-4 col-span-1">
              <span className="text-white text-lg font-semibold">
                {hoveredIndex === index ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.018 14L14.41 9.894a1 1 0 000-1.788L4.018 4A1 1 0 003 5v10a1 1 0 001.018 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <p
                className={`text-white whitespace-nowrap font-semibold cursor-pointer ${
                  hoveredIndex === index ? "underline" : ""
                }`}
              >
                {item.name}
              </p>
            </div>
            <div className="text-gray-400 col-span-1 text-right">
              {item.details}
            </div>
            <div className="text-gray-400 col-span-1 text-right flex justify-end items-center">
              <span>{item.duration}</span>
              {hoveredIndex === index && (
                <div className="relative bottom-2 ml-5">
                  <button
                    className="text-gray-400 text-2xl"
                    onClick={() => handleDropdownClick(index)}
                  >
                    ...
                  </button>
                  {dropdownIndex === index && (
                    <div className="absolute right-0 z-10  p-2 mt-2 w-72 bg-zinc-950 text-white rounded-lg drop-shadow-2xl">
                      <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                        Add to playlist
                      </button>
                      <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                        Save to your Liked Songs
                      </button>
                      <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                        Add to queue
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSongs;
