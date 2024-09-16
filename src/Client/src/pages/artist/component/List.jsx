import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "../utils/fetchSongData";
import PlayerControls from "../../../components/audio/PlayerControls";
import SongItem from "Client/src/components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";

const PopularSong = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const dropdownRefs = useRef([]);

  const handleRowClick = (song) => {
    setSelectedPlayer(song);
  };

  const handleLikeToggle = (index) => {
    setLikedSongs((prevLikedSongs) => ({
      ...prevLikedSongs,
      [index]: !prevLikedSongs[index],
    }));
  };
  const handleDropdownToggle = (index) => {
    setDropdownIndex(index === dropdownIndex ? null : index);
  };

  const firstSong = data.songs[0];
  const popularSongsList = data.songs.slice(0, 7);

  const itemHeight = 'h-[5rem]';
  const borderHeight = `h-[calc(${itemHeight} * 3)]`;

  return (
    <div className="p-4 text-white">
      <div className="flex">
        <div className={`flex flex-col flex-grow max-w-md ${borderHeight}`}>
          <h2 className="text-2xl font-bold mb-4">New Song</h2>
          {firstSong && (
            <div className="flex justify-center bg-gray-700 p-4 rounded-lg mt-2 h-full">
              <div className="flex items-start space-x-4"> 
                <img
                  src={firstSong.image}
                  alt={firstSong.name}
                  className="w-48 h-48 object-cover rounded-lg mt-3"
                />
                <div className="flex flex-col text-left mt-12">
                  <p className="text-sm font-semibold break-words custom-width">{firstSong.name}</p>
                  <p className="text-gray-400 text-sm break-words">{firstSong.artist}</p>
                </div>

              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow ml-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Popular</h2>
            <Link to={'/allsong'} className="text-blue-400 hover:underline">
              Show All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-[10px]">
            {popularSongsList.map((song, index) => (
              <div
                key={index}
                className={`relative flex items-center p-2 rounded-lg transition-colors 
                 ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""} 
                 ${itemHeight}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  handleRowClick(song);
                  setClickedIndex(index);
                }}
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex flex-col flex-grow ml-3">
                  <div className="flex justify-between items-center">
                    <div style={{ width: "150px" }}>
                      <p className="text-sm font-semibold song-name">{song.name}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-end">
                      <p className={`text-gray-500 text-sm w-20 text-right ${hoveredIndex === index ? "opacity-0" : ""}`}>
                        {song.duration}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{song.artist}</p>
                  <SongItem
                    key={index}
                    song={song}
                    index={index}
                    hoveredIndex={hoveredIndex}
                    clickedIndex={clickedIndex}
                    setHoveredIndex={setHoveredIndex}
                    setClickedIndex={setClickedIndex}
                    likedSongs={likedSongs}
                    handleLikeToggle={handleLikeToggle}
                    handleDropdownToggle={handleDropdownToggle}
                    dropdownIndex={dropdownIndex}
                    dropdownRefs={dropdownRefs}
                    setShowShareOptions={setShowShareOptions}
                    showShareOptions={showShareOptions}
                    align={'right'}
                  />
                </div>
              </div>
            ))}
            {selectedPlayer && (
              <PlayerControls
                title={selectedPlayer.name}
                artist={selectedPlayer.artist}
                Image={selectedPlayer.image}
                next={() => {/* next track */ }}
                prevsong={() => {/* previous track */ }}
                onTrackEnd={() => {/* Handle track end */ }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularSong;
