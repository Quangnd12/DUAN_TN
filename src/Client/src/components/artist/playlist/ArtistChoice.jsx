import React from "react";
import artistChoice from "../../../data/artistChoice";

const ArtistChoice = () => {
  return (
    <div>
      <h2 className="text-2xl text-white font-bold mb-4">Artist's choice</h2>
      <div className="cursor-pointer p-4 rounded-lg">
        <div className="flex items-center">
          <img
            src={artistChoice.image}
            alt={artistChoice.name}
            className="w-36 h-36 object-cover rounded-lg"
          />
          <div className="ml-4">
            <p className="text-white font-semibold">{artistChoice.name}</p>
            <p className="text-gray-400">{artistChoice.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistChoice;
