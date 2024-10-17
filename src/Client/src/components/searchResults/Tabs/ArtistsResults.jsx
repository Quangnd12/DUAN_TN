import React from 'react';

const ArtistsResults = ({ artists }) => (
  <div>
    <h2 className="text-xl text-white font-bold mb-4">Artists</h2>
    <div className="grid grid-cols-5 gap-4">
      {artists.map((artist, index) => (
        <div key={index} className="hover:bg-gray-500 w-52 p-2 rounded-md">
          <img src={artist.image} alt={artist.name} className="w-52 h-52 object-cover rounded-full mb-2" />
          <h3 className="font-bold text-white">{artist.name}</h3>
          <p className="text-gray-400">{artist.role}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ArtistsResults;