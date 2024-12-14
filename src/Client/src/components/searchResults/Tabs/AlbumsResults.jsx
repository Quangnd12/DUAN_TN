import React from 'react';
import { useNavigate } from 'react-router-dom';

const AlbumsResults = ({ albums }) => {
  const navigate = useNavigate();
  const albumItems = albums?.data?.albums?.items || [];

  if (!albumItems || albumItems.length === 0) {
    return (
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <div className="flex items-center justify-center h-40 bg-zinc-800/30 rounded-lg">
          <p className="text-gray-400">No albums found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-4">Albums</h2>
      <div className="grid grid-cols-5 gap-4">
        {albumItems.map((album, index) => (
          <div 
            key={index} 
            className="hover:bg-gray-500 w-52 p-2 rounded-md cursor-pointer"
          >
            <img 
              src={album.image} 
              alt={album.title} 
              className="w-52 h-52 object-cover rounded-md mb-2" 
            />
            <h3 className="font-bold text-white">{album.title}</h3>
            <p className="text-gray-400">
              {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Unknown Year'} 
              {album.artists?.names?.length > 0 
                ? ` • ${album.artists.names.join(', ')}` 
                : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumsResults;