import React from 'react';

const AlbumsResults = ({ albums }) => (
  <div>
    <h2 className="text-xl text-white font-bold mb-4">Albums</h2>
    <div className="grid grid-cols-5 gap-4">
      {albums.map((album, index) => (
        <div key={index} className="hover:bg-gray-500 w-52 p-2 rounded-md">
          <img src={album.image} alt={album.name} className="w-52 h-52 object-cover rounded-md mb-2" />
          <h3 className="font-bold text-white">{album.name}</h3>
          <p className="text-gray-400">
            {album.year} • {album.artist}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default AlbumsResults