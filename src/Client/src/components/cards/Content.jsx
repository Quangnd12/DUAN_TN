import React, { useState, useRef, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdCheckBoxOutlineBlank, MdCheck } from "react-icons/md";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";
import { PlayerContext } from "../context/MusicPlayer";
import SongItem from "../dropdown/dropdownMenu";
import useAge from "../calculateAge";
import { handleWarning } from "../notification";
import LikeButton from "../button/favorite";
import { formatDuration } from "Admin/src/components/formatDate";

const ContentCard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: followedArtists, isLoading, refetch } = useGetUserFollowedArtistsQuery(
    undefined,
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true
    }
  );

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
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
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium,
      artistID: followedArtists[index]?.id
    });
    setClickedIndex(index);
    try {
      const artistSongs = followedArtists[index]?.songs || [];
      localStorage.setItem("songs", JSON.stringify(artistSongs));
    } catch (error) {
      console.error("Lỗi khi lưu bài hát vào localStorage:", error);
    }
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

  // Thêm hàm để lấy bài hát mới nhất của mỗi nghệ sĩ
  const getLatestSong = (songs) => {
    if (!songs || songs.length === 0) return null;
    
    return songs.reduce((latest, current) => {
      const latestDate = new Date(latest.releaseDate);
      const currentDate = new Date(current.releaseDate);
      return currentDate > latestDate ? current : latest;
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!followedArtists || followedArtists.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Chưa có nghệ sĩ nào được theo dõi
      </div>
    );
  }

  return (
    <div className="w-full text-white">
      <div className="pt-4 w-full">
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 pt-2">
            {followedArtists?.map((artist, artistIndex) => {
              // Chỉ lấy bài hát mới nhất của nghệ sĩ
              const latestSong = getLatestSong(artist.songs);
              if (!latestSong) return null;

              return (
                <div
                  key={`${artist.id}-${latestSong.id}`}
                  className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                  ${hoveredIndex === artistIndex || clickedIndex === artistIndex ? "bg-gray-700" : ""}`}
                  onMouseEnter={() => setHoveredIndex(artistIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleRowClick(latestSong, artistIndex, artist)}
                >
                  {(hoveredIndex === artistIndex || selectedCheckboxes.size > 0) && (
                    <div
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className={`relative cursor-pointer ${selectedCheckboxes.has(artistIndex) ? 'text-gray-400' : 'text-gray-400'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxToggle(artistIndex);
                        }}
                      >
                        <MdCheckBoxOutlineBlank size={23} />
                        {selectedCheckboxes.has(artistIndex) && (
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
                      hoveredIndex === artistIndex || selectedCheckboxes.size > 0
                        ? "opacity-0"
                        : ""
                    }`}
                  >
                    {artistIndex + 1}
                  </p>

                  <img
                    src={latestSong.image}
                    alt={latestSong.title}
                    className="w-14 h-14 object-cover rounded-lg ml-2"
                  />

                  <div className="flex flex-grow flex-col ml-3 relative">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[400px]">
                          {latestSong.title}
                          <span className="ml-2 text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">
                            New
                          </span>
                        </p>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-end">
                        <div
                          className={`absolute right-[150px] transition-opacity duration-300 ${
                            hoveredIndex === artistIndex ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <LikeButton songId={latestSong.id} />
                        </div>
                        
                        <p
                          className={`text-gray-500 text-sm w-20 text-right ${
                            hoveredIndex === artistIndex ? "opacity-0" : ""
                          }`}
                        >
                          {formatDuration(latestSong.duration)}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-[430px]">
                      {artist.name}
                    </p>

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
                      align={'right'}
                      type="song"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
