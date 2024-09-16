import React, { useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
const SearchResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Songs", "Albums", "Playlists", "Artists"];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <>
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 border-2 rounded-lg ${
              activeTab === tab
                ? "bg-white text-black border-zinc-800"
                : "bg-zinc-800 text-gray-400 border-zinc-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
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
                <span className="text-gray-400">Bài hát</span>•
                {results.topResults.artist}
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
                  <span className="w-6 text-right mr-4 text-gray-400">
                    {index + 1}
                  </span>
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-1z h-14 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-white">
                      {song.title}
                    </h4>
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
                className="hover:bg-gray-500 w-52 p-2 rounded-md"
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
              <div
                key={index}
                className="hover:bg-gray-500 w-52 p-2 rounded-md"
              >
                <img
                  src={album.image}
                  alt={album.name}
                  className="w-52 h-52 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{album.name}</h3>
                <p className="text-gray-400">
                  {album.year} • {album.artist}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Popular Playlist */}
        <div>
          <h2 className="text-xl font-bold mb-4">Playlists</h2>
          <div className="grid grid-cols-5 gap-4">
            {results.playlists.map((playlist, index) => (
              <div
                key={index}
                className="hover:bg-gray-500 w-52 p-2 rounded-md"
              >
                <img
                  src={playlist.image}
                  alt={playlist.author}
                  className="w-52 h-52 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{playlist.title}</h3>
                <p className="text-gray-400">{playlist.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
