import React, { useState, useEffect, useRef, useContext } from "react";
import {
  MdPlayArrow,
  MdShuffle,
  MdCheckBoxOutlineBlank,
  MdPlaylistAdd,
  MdCheck,
} from "react-icons/md";
import SongItem from "../../../components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";
import MoreButton from "../../../components/button/more";
import { handleAddPlaylist, handleWarning } from "../../../components/notification";
import { getSongs } from '../../../../../services/songs';
import { useParams,useNavigate } from "react-router-dom";
import { formatDuration } from "Admin/src/components/formatDate";
import { PlayerContext } from "Client/src/components/context/MusicPlayer";
import useAge from "Client/src/components/calculateAge";
import LikeButton from "../../../components/button/favorite";


const ListSongOfGenres = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [likedSongs, setLikedSongs] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [Songs, setSongs] = useState([]);
  const dropdownRefs = useRef({});
  const { id } = useParams();
  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const navigate=useNavigate();

  const SongData = async (page = 0, limit = 0, search = '', genre = [], minDuration = 0, maxDuration = 0, minListensCount = 0, maxListensCount = 0) => {
    const data = await getSongs(page, limit, search, genre, minDuration, maxDuration, minListensCount, maxListensCount);
    setSongs(data.songs || []);
  };

  const useDebouncedValue = (value, delay = 1000) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
  };

  const debounced = useDebouncedValue(id);

  useEffect(() => {
    if (id) {
      const genre = JSON.parse(id)
      SongData(0, 0, '', [genre]);
    }
  }, [debounced]);

  const playFirstSong = () => {
    if (Songs.length > 0) {
      const firstSong = Songs[0];
      setPlayerState({
        audioUrl: firstSong.file_song,
        title: firstSong.title,
        artist: firstSong.artist,
        Image: firstSong.image,
        lyrics: firstSong.lyrics,
        album: firstSong.album,
        playCount: firstSong.listens_count,
        TotalDuration: firstSong.duration,
        songId: firstSong.id,
        is_premium: firstSong.is_premium,
        artistID: firstSong.artistID,
      });
    }
  };

  const playRandomSong = () => {
    if (Songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * Songs.length);
      const randomSong = Songs[randomIndex];
      setPlayerState({
        audioUrl: randomSong.file_song,
        title: randomSong.title,
        artist: randomSong.artist,
        Image: randomSong.image,
        lyrics: randomSong.lyrics,
        album: randomSong.album,
        playCount: randomSong.listens_count,
        TotalDuration: randomSong.duration,
        songId: randomSong.id,
        is_premium: randomSong.is_premium,
        artistID: randomSong.artistID,
      });
    }
  };

  const handleRowClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    } 
      else {
      setPlayerState({
        audioUrl: song.file_song,
        title: song.title,
        artist: song.artist,
        Image: song.image,
        lyrics: song.lyrics,
        album: song.album,
        playCount: song.listens_count,
        TotalDuration: song.duration,
        songId: song.id,
        is_premium:song.is_premium,
        artistID:song.artistID
      });
      setClickedIndex(index);
      try {
        localStorage.setItem("songs", JSON.stringify(Songs));
      } catch (error) {
        console.error("Error saving songs to localStorage:", error);
      }
    }
  };


  const handleOptionSelect = (action) => {
    console.log("Selected action:", action);
    // Xử lý action tại đây
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
      } else if (updatedCheckboxes.size === 0) {
        setIsSelectAllChecked(false);
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

  return (

    <div className="pt-4  w-full text-white ">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3" onClick={playFirstSong}>
              <MdPlayArrow size={24} />
            </button>
          
            <div className="ml-6">
              {/* <LikeButton
                  likedSongs={likedSongs[0]}
                  handleLikeToggle={() => handleLikeToggle(0)}

              /> */}
            </div>
          </div>
          <button className="flex items-center bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition" onClick={playRandomSong}>
              <MdShuffle size={24} />
            </button>
        </div>
        <div className="flex">
          {isAnyCheckboxSelected() && (
            <div
              className="relative flex items-center p-2 rounded-lg mb-2 cursor-pointer "
              onClick={handleSelectAll}
            >
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
                <div className="relative">
                  <MdCheckBoxOutlineBlank
                    className="text-gray-400 cursor-pointer hover:text-gray-600"
                    size={23}
                  />
                  {isSelectAllChecked && (
                    <MdCheck
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400"
                      size={16}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {isAnyCheckboxSelected() && (
            <div className="ml-6 relative flex items-center p-1 w-400 rounded-3xl  border border-gray-600  cursor-pointer bg-black mb-2">
              <MdPlaylistAdd size={23} className="text-gray-400 mr-2 ml-2" />
              <p
                className="text-gray-400 text-sm mr-2"
                onClick={handleAddPlaylist}
              >
                Add to playlist{" "}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 pt-2">
          {Songs.filter(song => {
            const today = new Date();
            const releaseDate = new Date(song.releaseDate);
            return releaseDate <= today;
          }).map((song, index) => (
            <div
              key={index}
              className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                   ${hoveredIndex === index || clickedIndex === index
                  ? "bg-gray-700"
                  : ""
                }`}
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
                    className={`relative cursor-pointer ${selectedCheckboxes.has(index)
                      ? "text-gray-400"
                      : "text-gray-400"
                      }`}
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
                className={`text-sm font-semibold w-8 text-center ${hoveredIndex === index || selectedCheckboxes.size > 0
                  ? "opacity-0"
                  : ""
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
                      className={`text-gray-500 text-sm w-20 text-right ${hoveredIndex === index ? "opacity-0" : ""
                        }`}
                    >
                      {formatDuration(song.duration)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-[430px]">{song.artist}</p>
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
                  align={"right"}
                  type="song"
                />
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ListSongOfGenres;
