import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { useGetPublicPlaylistsQuery } from '../../../../../../src/redux/slice/playlistSlice'; // Import đúng API hook

const PlaylistsResults = () => {
  const { data: playlists, error, isLoading } = useGetPublicPlaylistsQuery();
  const navigate = useNavigate();

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlistpulic/${playlistId}`); // Điều hướng đến trang chi tiết playlist
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-4">Playlists</h2>
      <div className="grid grid-cols-5 gap-4">
        {playlists.map((playlist, index) => (
          <div
            key={index}
            className="hover:bg-gray-500 w-52 p-2 rounded-md cursor-pointer"
            onClick={() => handlePlaylistClick(playlist.id)} // Gọi hàm khi click
          >
            <img
              src={playlist.image}
              alt={playlist.name}
              className="w-52 h-52 object-cover rounded-md mb-2"
            />
            <h3 className="font-bold text-white">{playlist.name}</h3>
            <p className="text-gray-400">{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsResults;
