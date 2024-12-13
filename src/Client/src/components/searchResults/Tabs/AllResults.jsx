import React, { useState, useContext } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from 'Client/src/components/context/MusicPlayer';
import { handleWarning } from '../../../components/notification';
import useAge from 'Client/src/components/calculateAge';
import { useGetPublicPlaylistsQuery } from "../../../../../../src/redux/slice/playlistSlice";

const AllResults = ({ results }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const age = useAge();
  const [isPlaying, setIsPlaying] = useState(false);
  const { setPlayerState, playerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const { data: apiPlaylists, error, isLoading } = useGetPublicPlaylistsQuery();

  const handlePlayTopResult = (e) => {
    e.stopPropagation();
    const song = results?.data?.songs?.items[0];
    if (!song) return;

    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      return;
    }

    if (isPlaying && playerState?.songId === song.id) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setPlayerState({
      audioUrl: song.file_song,
      title: song.title,
      artists: song.artists?.join(', ') || song.artist || '',
      Image: song.image,
      playCount: song.listens_count || 0,
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium || 0,
      artistName: song.artists?.join(', ') || song.artist || '',
    });
  };

  const handleSongClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    }
    
    setPlayerState({
      audioUrl: song.file_song,
      title: song.title,
      artists: song.artists?.join(', ') || song.artist || '',
      Image: song.image,
      playCount: song.listens_count || 0,
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium || 0,
      artistName: song.artists?.join(', ') || song.artist || '',
    });
    setClickedIndex(index);
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlistpulic/${playlistId}`);
  };

  const handleArtistClick = (artistName) => {
    navigate(`/artist/${artistName}`);
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleIconClick = () => setIsHovered(!isHovered);

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
            {results?.data?.songs?.items[0] && (
              <div
                className="relative h-5/6 bg-zinc-800 hover:bg-gray-700 p-4 rounded-md"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={results.data.songs.items[0].image}
                  alt={results.data.songs.items[0].title}
                  className="w-48 h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold">{results.data.songs.items[0].title}</h3>
                <p className="text-white font-bold">
                  <span className="text-gray-400">Bài hát</span> • {results.data.songs.items[0].artists?.join(', ') || 'Unknown Artist'}
                </p>

                {isHovered && (
                  <>
                    {isPlaying && playerState?.songId === results.data.songs.items[0].id ? (
                      <FaPauseCircle
                        onClick={handlePlayTopResult}
                        className="w-16 h-16 absolute bottom-5 right-5 bg-sky-500 text-white rounded-full p-2 cursor-pointer hover:bg-sky-600 transition-colors"
                      />
                    ) : (
                      <FaCirclePlay
                        onClick={handlePlayTopResult}
                        className="w-16 h-16 absolute bottom-5 right-5 bg-sky-500 text-white rounded-full p-2 cursor-pointer hover:bg-sky-600 transition-colors"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="w-2/3">
            <h2 className="text-xl font-bold mb-4">Songs</h2>
            <div className="space-y-4">
              {results?.data?.songs?.items && results.data.songs.items.length > 0 ? (
                results.data.songs.items.map((song, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg transition-all cursor-pointer
                      ${hoveredIndex === index || clickedIndex === index 
                        ? "bg-gray-700/50" 
                        : "hover:bg-gray-800/30"}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleSongClick(song, index)}
                  >
                    <div className="w-8 flex justify-center">
                      {hoveredIndex === index || clickedIndex === index ? (
                        <FaCirclePlay className="text-white" size={22} />
                      ) : (
                        <span className="text-gray-400 text-sm">{index + 1}</span>
                      )}
                    </div>

                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded-md mx-4"
                    />
                    
                    <div className="flex-grow flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium text-sm truncate
                          ${clickedIndex === index ? 'text-blue-400' : 'text-white'}`}>
                          {song.title}
                        </h4>
                        {song.is_premium === 1 && (
                          <span className="bg-yellow-500/90 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs mt-0.5">
                        <p className="truncate">{song.artists?.join(', ') || song.artist}</p>
                      </div>
                    </div>

                    <span className="text-gray-400 text-sm ml-4">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No songs found</p>
              )}
            </div>
          </div>
        </div>
        {/* Popular Artists */}
        <div>
          <h2 className="text-xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-5 gap-4">
            {results.artists && results.artists.map((artist, index) => (
              <div
                key={index}
                className="hover:bg-gray-500 w-52 p-2 rounded-md cursor-pointer"
                onClick={() => handleArtistClick(artist.name)}
              >
                <img
                  src={artist.image || artist.avatar}
                  alt={artist.name}
                  className="w-52 h-52 object-cover rounded-full mb-2"
                />
                <h3 className="font-bold">{artist.name}</h3>
                <p className="text-gray-400">{artist.role || 'Artist'}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Popular Albums */}
        <div>
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-5 gap-4">
            {results?.data?.albums?.items && results.data.albums.items.map((album, index) => (
              <div 
                key={index} 
                className="hover:bg-gray-500 w-52 p-2 rounded-md cursor-pointer"
                onClick={() => handleAlbumClick(album.id)}
              >
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-52 h-52 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-white">{album.title}</h3>
                <p className="text-gray-400">
                  {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Unknown Year'} 
                  {album.artists && album.artists.names && album.artists.names.length > 0 
                    ? ` • ${album.artists.names.join(', ')}` 
                    : ' • Unknown Artist'}
                </p>
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
