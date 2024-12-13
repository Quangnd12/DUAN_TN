import React, { useState, useRef, useContext } from "react";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";
import { PlayerContext } from "../context/MusicPlayer";
import SongItem from "../dropdown/dropdownMenu";
import useAge from "../calculateAge";
import { handleWarning } from "../notification";
import LikeButton from "../button/favorite";
import { formatDuration } from "Admin/src/components/formatDate";

const InfoClientCard = () => {
  const { data: followedArtists, isLoading } = useGetUserFollowedArtistsQuery();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [likedSongs, setLikedSongs] = useState({});

  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const dropdownRefs = useRef({});

  const getLatestSong = (songs) => {
    if (!songs || songs.length === 0) return null;
    
    return songs.reduce((latest, current) => {
      const latestDate = new Date(latest.releaseDate);
      const currentDate = new Date(current.releaseDate);
      return currentDate > latestDate ? current : latest;
    });
  };

  const handleRowClick = (song, index, artist) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    }
    setPlayerState({
      audioUrl: song.file,
      title: song.title,
      artist: artist.name,
      Image: song.image,
      lyrics: song.lyrics,
      album: artist.name,
      playCount: song.listens_count || 0,
      TotalDuration: song.duration
    });
    setClickedIndex(index);
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

  if (isLoading) return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="space-y-2">
        {followedArtists?.map((artist, artistIndex) => {
          const latestSong = getLatestSong(artist.songs);
          if (!latestSong) return null;

          return (
            <div
              key={`${artist.id}-${latestSong.id}`}
              className={`flex items-center p-4 rounded-lg
                ${hoveredIndex === artistIndex ? "bg-gray-800/50" : "bg-transparent"}
                hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer`}
              onMouseEnter={() => setHoveredIndex(artistIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleRowClick(latestSong, artistIndex, artist)}
            >
              {/* Song Number */}
              <span className="w-8 text-center text-sm font-medium text-gray-400">
                {artistIndex + 1}
              </span>

              {/* Song Image */}
              <img
                src={latestSong.image}
                alt={latestSong.title}
                className="w-14 h-14 rounded-md object-cover mx-4"
              />

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="text-white font-medium truncate max-w-[400px]">
                      {latestSong.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate max-w-[430px]">
                      {artist.name}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-6">
                    <LikeButton songId={latestSong.id} />
                    <span className="text-gray-400 text-sm">
                      {formatDuration(latestSong.duration)}
                    </span>
                    <div className="relative">
                      <SongItem
                        song={latestSong}
                        index={artistIndex}
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
                        align="right"
                        type="song"
                        className="z-50"
                        menuClassName="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoClientCard;
