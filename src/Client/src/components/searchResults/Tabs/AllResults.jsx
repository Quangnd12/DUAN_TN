import React, { useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetPublicPlaylistsQuery } from "../../../../../../src/redux/slice/playlistSlice";

const AllResults = ({ results }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { data: apiPlaylists, error, isLoading } = useGetPublicPlaylistsQuery();

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlistpulic/${playlistId}`);
  };

  const handleArtistClick = (artistName) => {
    navigate(`/artist/${artistName}`);
  };

  const handleIconClick = () => setIsPlaying(!isPlaying);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const renderPlaylists = () => {
    if (isLoading) return <p className="text-gray-400">Loading playlists...</p>;
    if (error) return renderPlaylistGrid(results.playlists);

    const playlistsToShow = apiPlaylists || results.playlists;
    return renderPlaylistGrid(playlistsToShow);
  };

  const renderPlaylistGrid = (playlists) => (
    <div className="grid grid-cols-5 gap-4">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="hover:bg-gray-500 w-52 p-2 rounded-md cursor-pointer"
          onClick={() => handlePlaylistClick(playlist.id)}
        >
          <img
            src={playlist.image}
            alt={playlist.name || playlist.title}
            className="w-52 h-52 object-cover rounded-md mb-2"
          />
          <h3 className="font-bold text-white">{playlist.name || playlist.title}</h3>
          <p className="text-gray-400">{playlist.description || playlist.author}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="text-white">
        <div className="flex mb-8">
          <div className="w-1/3 pr-4">
            <h2 className="text-xl font-bold mb-4">Top Results</h2>
            <div
              className="relative h-5/6 bg-zinc-800 hover:bg-gray-700 p-4 rounded-md"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={results.topResults.image}
                alt={results.topResults.name}
                className="w-48 h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-bold">{results.topResults.name}</h3>
              <p className="text-white font-bold">
                <span className="text-gray-400">Bài hát</span> • {results.topResults.artist}
              </p>

              <div>
                {(isHovered || isPlaying) &&
                  (isPlaying ? (
                    <FaPauseCircle
                      onClick={handleIconClick}
                      className="w-16 h-16 absolute bottom-5 right-5 bg-sky-500 text-white rounded-full p-2"
                    />
                  ) : (
                    <FaCirclePlay
                      onClick={handleIconClick}
                      className="w-16 h-16 absolute bottom-5 right-5 bg-sky-500 text-white rounded-full p-2"
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="w-2/3">
            <h2 className="text-xl font-bold mb-4">Songs</h2>
            <div className="space-y-4">
              {results.songs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center bg-zinc-900 p-2 rounded-md hover:bg-gray-500"
                >
                  <span className="w-6 text-right mr-4 text-gray-400">{index + 1}</span>
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-12 h-14 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-white">{song.title}</h4>
                    <p className="text-gray-400">{song.artist}</p>
                  </div>
                  <span className="text-gray-400 ml-20">{song.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Popular Artists */}
        <div>
          <h2 className="text-xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-5 gap-4">
            {results.artists.map((artist, index) => (
              <div
                key={index}
                className="hover:bg-gray-500 w-52 p-2 rounded-md cursor-pointer"
                onClick={() => handleArtistClick(artist.name)}
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-52 h-52 object-cover rounded-full mb-2"
                />
                <h3 className="font-bold">{artist.name}</h3>
                <p className="text-gray-400">{artist.role}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Popular Albums */}
        <div>
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-5 gap-4">
            {results.albums.map((album, index) => (
              <div key={index} className="hover:bg-gray-500 w-52 p-2 rounded-md">
                <img
                  src={album.image}
                  alt={album.name}
                  className="w-52 h-52 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{album.name}</h3>
                <p className="text-gray-400">{album.year} • {album.artist}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Popular Playlists */}
        <div>
          <h2 className="text-xl font-bold mb-4">Playlists</h2>
          {renderPlaylists()}
        </div>
      </div>
    </div>
  );
};

export default AllResults;
