import React from 'react';

const PlaylistsResults = ({ playlists }) => (
  <div>
    <h2 className="text-xl text-white font-bold mb-4">Playlists</h2>
    <div className="grid grid-cols-5 gap-4">
      {playlists.map((playlist, index) => (
        <div key={index} className="hover:bg-gray-500 w-52 p-2 rounded-md">
          <img src={playlist.image} alt={playlist.title} className="w-52 h-52 object-cover rounded-md mb-2" />
          <h3 className="font-bold text-white">{playlist.title}</h3>
          <p className="text-gray-400">{playlist.author}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PlaylistsResults