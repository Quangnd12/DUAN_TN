import React, { useState, useRef, useContext } from "react";
import { MdCheckBoxOutlineBlank, MdCheck } from "react-icons/md";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";
import { PlayerContext } from "../context/MusicPlayer";
import SongItem from "../dropdown/dropdownMenu";
import useAge from "../calculateAge";
import { handleWarning } from "../notification";
import LikeButton from "../button/favorite";
import { formatDuration } from "Admin/src/components/formatDate";

const ContentCard = () => {
  const { data: followedArtists, isLoading } = useGetUserFollowedArtistsQuery();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [likedSongs, setLikedSongs] = useState({});

  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const dropdownRefs = useRef({});

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

  const handleCheckboxToggle = (index) => {
    setSelectedCheckboxes(prevSelectedCheckboxes => {
      const updatedCheckboxes = new Set(prevSelectedCheckboxes);
      if (updatedCheckboxes.has(index)) {
        updatedCheckboxes.delete(index);
      } else {
        updatedCheckboxes.add(index);
      }
      return updatedCheckboxes;
    });
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

  const isAnyCheckboxSelected = () => {
    return selectedCheckboxes.size > 0;
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div className="w-full text-white">
      <div className="pt-4 w-full">
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 pt-2">
            {followedArtists?.map(artist =>
              artist.songs?.map((song, index) => (
                <div
                  key={`${artist.id}-${song.id}`}
                  className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                  ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleRowClick(song, index, artist)}
                >
                  {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                    <div
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? 'text-gray-400' : 'text-gray-400'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxToggle(index);
                        }}
                      >
                        <MdCheckBoxOutlineBlank size={23} />
                        {selectedCheckboxes.has(index) && (
                          <MdCheck
                            size={16}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <p
                    className={`text-sm font-semibold w-8 text-center ${
                      hoveredIndex === index || selectedCheckboxes.size > 0
                        ? "opacity-0"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </p>

                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-14 h-14 object-cover rounded-lg ml-2"
                  />

                  <div className="flex flex-grow flex-col ml-3 relative">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[400px]">
                        {song.title}
                      </p>

                      <div className="absolute inset-0 flex items-center justify-end">
                        <div className="absolute right-[250px]">
                          <LikeButton songId={song.id} />
                        </div>
                        
                        <p
                          className={`text-gray-500 text-sm w-20 text-right ${
                            hoveredIndex === index ? "opacity-0" : ""
                          }`}
                        >
                          {formatDuration(song.duration)}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-[430px]">
                      {artist.name}
                    </p>

                    <SongItem
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
                      type="song"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
