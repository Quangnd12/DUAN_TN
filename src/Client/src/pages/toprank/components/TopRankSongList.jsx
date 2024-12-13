import React, { useState, useEffect, useRef, useContext } from "react";
import {
    MdPlayArrow,
    MdShuffle,
    MdCheckBoxOutlineBlank,
    MdPlaylistAdd,
    MdCheck,
} from "react-icons/md";
import {
    AiFillPlayCircle,
    AiOutlineHeart,
    AiOutlineCalendar,
} from "react-icons/ai";
import SongItem from "../../../components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";
import LikeButton from "../../../components/button/favorite";
import MoreButton from "../../../components/button/more";
import { handleAddPlaylist, handleWarning } from "../../../components/notification";
import { getSongs } from '../../../../../services/songs';
import { useParams } from "react-router-dom";
import { formatDuration } from "Admin/src/components/formatDate";
import { PlayerContext } from "Client/src/components/context/MusicPlayer";
import useAge from "Client/src/components/calculateAge";

const TopRankSongList = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [likedSongs, setLikedSongs] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [Songs, setSongs] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const dropdownRefs = useRef({});
  const { id } = useParams();
  const { 
    setPlayerState, 
    clickedIndex, 
    setClickedIndex,
    currentSong,
    isPlaying
  } = useContext(PlayerContext);
  const age = useAge();

    const [topSongs, setTopSongs] = useState([]);
    const [genreData, setGenreData] = useState(null);

  const SongData = async () => {
    if (id) {
      const genre = JSON.parse(id);
      const data = await getSongs(0, 100, '', [genre]);
      const filteredSongs = (data.songs || [])
        .filter(song => song.listens_count >= 100000)
        .sort((a, b) => b.listens_count - a.listens_count);
      setSongs(filteredSongs);
      setTopSongs(filteredSongs.slice(0, 1));
    }
  };

    useEffect(() => {
        SongData();
    }, [id]);

  const handleRowClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    }
    
    setPlayerState({
      audioUrl: song.file_song,
      title: song.title,
      artist: song.artist,
      Image: song.image,
      lyrics: song.lyrics,
      album: song.albumTitle,
      playCount: song.listens_count,
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium
    });
    setClickedIndex(index);
    
    try {
      localStorage.setItem("songs", JSON.stringify(Songs));
    } catch (error) {
      console.error("Error saving songs to localStorage:", error);
    }
  };

  const handlePlayAll = () => {
    if (Songs.length > 0) {
      const validSongs = Songs.filter(song => 
        song.is_explicit !== 1 || age >= 18
      );
      
      if (validSongs.length > 0) {
        handleRowClick(validSongs[0], 0);
      } else {
        handleWarning();
      }
    }
  };

  const handleShufflePlay = () => {
    if (Songs.length > 0) {
      const validSongs = Songs.filter(song => 
        song.is_explicit !== 1 || age >= 18
      );
      
      if (validSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSongs.length);
        handleRowClick(validSongs[randomIndex], randomIndex);
      } else {
        handleWarning();
      }
    }
  };

  // Giữ nguyên các hàm xử lý khác từ GenreList
  const handleOptionSelect = (action) => {
    console.log("Selected action:", action);
  };

  const handleCheckboxToggle = (index) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      const updatedCheckboxes = new Set(prevSelectedCheckboxes);
      if (updatedCheckboxes.has(index)) {
        updatedCheckboxes.delete(index);
      } else {
        updatedCheckboxes.add(index);
      }

      if (updatedCheckboxes.size === Songs.length) {
        setIsSelectAllChecked(true);
      } else {
        setIsSelectAllChecked(false);
      }

      return updatedCheckboxes;
    });
  };

  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      setSelectedCheckboxes(new Set());
    } else {
      const allIndices = Songs.map((_, idx) => idx);
      setSelectedCheckboxes(new Set(allIndices));
    }
    setIsSelectAllChecked(!isSelectAllChecked);
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

  // Format số lượt xem
  const formatListenCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full text-white p-4 rounded-md backdrop-filter backdrop-blur-md">
        {/* Sidebar - chỉ hiển thị bài hát đầu tiên */}
        <div className="w-1/3 p-4 flex flex-col flex-shrink-0">
          <div className="mb-8">
            {topSongs.length > 0 && (
              <div className="w-80 bg-black rounded-xl overflow-hidden shadow-2xl border border-purple-500 mb-4">
                <div className="p-4 relative">
                  <div className="absolute inset-0 bg-purple-900 opacity-10 animate-pulse"></div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Top 1
                  </h1>
                  <div className="relative group mb-4">
                    <img
                      src={topSongs[0].image}
                      alt="Album Cover"
                      className="w-full h-auto object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <AiFillPlayCircle
                        className="w-12 h-12 text-white cursor-pointer"
                        onClick={() => handleRowClick(topSongs[0], 0)}
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-white mt-2 relative z-10 text-center">
                    {topSongs[0].title}
                  </h2>
                  <div className="flex items-center justify-between text-purple-300 text-sm mb-2 relative z-10">
                    <span className="flex items-center">
                      <AiOutlineCalendar className="w-4 h-4 mr-1" />
                      {new Date(topSongs[0].releaseDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <AiOutlineHeart className="w-4 h-4 mr-1 text-pink-500" />
                      {formatListenCount(topSongs[0].listens_count)} lượt nghe
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm relative z-10">
                    {topSongs[0].artist}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content - Danh sách bài hát */}
        <div className="w-2/3 p-4 scroll-hidden smooth-scroll h-screen">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button 
                  className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3"
                  onClick={handlePlayAll}
                >
                  <MdPlayArrow size={24} />
                </button>
                <div className="ml-6">
                  <LikeButton
                    likedSongs={likedSongs[0]}
                    handleLikeToggle={() => handleLikeToggle(0)}
                  />
                </div>
                <div className="ml-6">
                  <MoreButton
                    type="albumPlaylist"
                    onOptionSelect={handleOptionSelect}
                  />
                </div>
              </div>
              <button 
                className="flex items-center bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition"
                onClick={handleShufflePlay}
              >
                <MdShuffle size={24} />
              </button>
            </div>

            {/* Checkbox controls */}
            <div className="flex">
              {isAnyCheckboxSelected() && (
                <>
                  <div
                    className="relative flex items-center p-2 rounded-lg mb-2 cursor-pointer"
                    onClick={handleSelectAll}
                  >
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
                      <div className="relative">
                        <MdCheckBoxOutlineBlank className="text-gray-400 cursor-pointer hover:text-gray-600" size={23} />
                        {isSelectAllChecked && (
                          <MdCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" size={16} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 relative flex items-center p-1 w-400 rounded-3xl border border-gray-600 cursor-pointer bg-black mb-2">
                    <MdPlaylistAdd size={23} className="text-gray-400 mr-2 ml-2" />
                    <p className="text-gray-400 text-sm mr-2" onClick={handleAddPlaylist}>
                      Add to playlist
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Song list */}
            <div className="flex flex-col gap-4 pt-2">
              {Songs.map((song, index) => (
                <div
                  key={index}
                  className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                    ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleRowClick(song, index)}
                >
                  {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                    <div
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4"
                      style={{ zIndex: 2 }}
                    >
                      <div
                        className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? "text-gray-400" : "text-gray-400"}`}
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
                      hoveredIndex === index || selectedCheckboxes.size > 0 ? "opacity-0" : ""
                    }`}
                  >
                    {index + 1}
                  </p>
                  <img
                    src={song.image}
                    alt={song.name}
                    className="w-14 h-14 object-cover rounded-lg ml-2"
                  />
                  <div className="flex flex-grow flex-col ml-3 relative">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center w-[400px] whitespace-nowrap overflow-hidden text-ellipsis">
                        <p className="text-sm font-semibold overflow-hidden text-ellipsis">
                          {song.title}
                        </p>
                        {song.is_premium === 1 && (
                          <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-2 shrink-0">
                            PREMIUM
                          </span>
                        )}
                        <span className="ml-2 text-xs text-gray-400">
                          {formatListenCount(song.listens_count)} lượt nghe
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500 text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis w-[430px]">
                          {song.album}
                        </p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-end">
                        <div className="mr-10">
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
                      {song.artist}
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
                      align={"right"}
                      type="song"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRankSongList; 