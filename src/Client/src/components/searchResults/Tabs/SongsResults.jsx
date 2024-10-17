import React from 'react';

const SongsResults = ({ songs }) => (
  <div>
    <h2 className="text-xl text-white font-bold mb-4">Songs</h2>
    <div className="space-y-4">
      {songs.map((song, index) => (
        <div key={index} className="flex items-center bg-zinc-900 p-2 rounded-md hover:bg-gray-500">
          <span className="w-6 text-right mr-4 text-gray-400">{index + 1}</span>
          <img src={song.image} alt={song.title} className="w-14 h-14 object-cover rounded-md mr-4" />
          <div className="flex-grow">
            <h4 className="font-semibold text-white text-lg">{song.title}</h4>
            <p className="text-gray-400">{song.artist}</p>
          </div>
          <span className="text-gray-400 ml-20">{song.duration}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SongsResults