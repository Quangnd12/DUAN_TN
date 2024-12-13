import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { PlayerContext } from "Client/src/components/context/MusicPlayer";
import { getAllArtists, getArtistById } from "../../../../../services/artist";
import SongItem from "../../../components/dropdown/dropdownMenu";
import useAge from "Client/src/components/calculateAge";
import { handleWarning } from "../../../components/notification";
import "../../../assets/css/artist/artist.css";
import { slugify } from "Client/src/components/createSlug";
import { formatDuration } from "Client/src/components/format";
import LikeButton from "Client/src/components/button/favorite";

const PopularSong = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [artistData, setArtistData] = useState([]);
  const [currentArtist, setCurrentArtist] = useState(null);
  const dropdownRefs = useRef({});
  const { artistName } = useParams();
  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      setIsLoading(true);
      try {
        const { artists } = await getAllArtists();
        const artist = artists.find(a => slugify(a.name) === artistName);

        if (artist) {
          const artistDetails = await getArtistById(artist.id);
          setCurrentArtist(artistDetails);

          // Chuyển đổi cấu trúc songs để phù hợp với component
          const formattedSongs = artistDetails.songs.map(song => ({
            id: song.id,
            title: song.title,
            file_song: song.file,
            image: song.image,
            lyrics: song.lyrics,
            name: artistDetails.name,
            is_explicit: song.is_explicit || 0,
            listens_count: song.listens_count || 0,
            duration: song.duration || 0,
            is_premium: song.is_premium,
            artistID: artistDetails.id,
            releaseDate: song.releaseDate,
            albumID: song.albumId,
            albumName: song.albumTitle
          }));

          setArtistData(formattedSongs);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchArtistData();
  }, [artistName]);

  const isReleased = (releaseDate) => {
    if (!releaseDate) return true;
    const today = new Date();
    const release = new Date(releaseDate);
    return release <= today;
  };

  const getNewestSong = () => {
    if (!artistData.length) return null;
    const releasedSongs = artistData.filter(song => isReleased(song.releaseDate));
    return releasedSongs.reduce((newest, current) => {
      if (!newest) return current;
      return current.id > newest.id ? current : newest;
    }, null);
  };

  const getPopularSongs = () => {
    const newestSong = getNewestSong();
    if (!newestSong) return [];

    return artistData
      .filter(song => song.id !== newestSong.id && isReleased(song.releaseDate))
      .slice(0, 7);
  };

  const handleRowClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    }

    setPlayerState({
      audioUrl: song.file_song,
      title: song.title,
      artist: song.name,
      Image: song.image,
      lyrics: song.lyrics,
      album: song.title,
      playCount: song.listens_count,
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium,
      artistID: song.artistID
    });
    setClickedIndex(index);

    try {
      const songsToStore = artistData.map(song => ({
        ...song,
        file: song.songFile,
        title: song.songTitle,
        image: song.songImage,
        lyrics: song.songLyrics,
        duration: song.duration,
        listens_count: song.listens_count
      }));
      localStorage.setItem("songs", JSON.stringify(songsToStore));
    } catch (error) {
      console.error("Error saving songs to localStorage:", error);
    }
  };

  const handleLikeToggle = (index) => {
    setLikedSongs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDropdownToggle = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleCheckboxToggle = (index) => {
    setSelectedCheckboxes(prevSelectedCheckboxes => {
      const updatedCheckboxes = new Set(prevSelectedCheckboxes);
      if (updatedCheckboxes.has(index)) {
        updatedCheckboxes.delete(index);
      } else {
        updatedCheckboxes.add(index);
      }

      setIsSelectAllChecked(updatedCheckboxes.size === artistData.length);
      return updatedCheckboxes;
    });
  };

  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      setSelectedCheckboxes(new Set());
    } else {
      const allIndices = artistData.map((_, idx) => idx);
      setSelectedCheckboxes(new Set(allIndices));
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };

  const isAnyCheckboxSelected = () => {
    return selectedCheckboxes.size > 0;
  };

  const newestSong = getNewestSong();
  const popularSongs = getPopularSongs();

  const itemHeight = "h-[5rem]";
  const borderHeight = `h-[calc(${itemHeight} * 3)]`;

  if (isLoading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-white p-4">Error: {error}</p>;
  if (!currentArtist) return <p className="text-white p-4">Artist not found</p>;

  return (
    <div className="p-4 text-white">
      <div className="flex">
        <div className={`flex flex-col flex-grow max-w-md ${borderHeight}`}>
          <h2 className="text-2xl font-bold mb-4">New Song</h2>
          {newestSong && (
            <div className="flex justify-center bg-gray-700 p-4 rounded-lg mt-2 h-full">
              <div
                className="flex items-start space-x-4 cursor-pointer"
                onClick={() => handleRowClick(newestSong, 0)}
              >
                <img
                  src={newestSong.image}
                  alt={newestSong.title}
                  className="w-48 h-48 object-cover rounded-lg mt-3"
                />
                <div className="flex flex-col text-left mt-12">
                  <p className="text-sm font-semibold overflow-hidden text-ellipsis w-[200px] line-clamp-2">
                    {newestSong.title}
                  </p>
                  <p className="text-gray-400 text-sm break-words pt-2">
                    {newestSong.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow ml-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Popular</h2>
            <Link
              to={`/artist/${artistName}/song`}
              className="text-blue-400 hover:underline"
            >
              Show All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-[10px]">
            {popularSongs.map((song, index) => (
              <div
                key={song.id}
                className={`relative flex items-center p-2 rounded-lg transition-colors 
                  ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""} 
                  ${itemHeight}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleRowClick(song, index + 1)}
              >
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex flex-col flex-grow ml-3">
                  <div className="flex justify-between items-center">
                    <div style={{ width: "150px" }}>
                      <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[150px]">
                        {song.title}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-end">
                      <p
                        className={`text-gray-500 text-sm w-20 text-right mr-2 ${hoveredIndex === index ? "opacity-0" : ""
                          }`}
                      >
                        {formatDuration(song.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1" style={{ zIndex: 1 }}>
                    <span className="flex items-center">
                      <p className="text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                        {song.name}
                      </p>
                    </span>
                  </div>

                  <SongItem
                   key={index}
                   song={{
                       ...song,
                       id: song.id
                   }}
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
                <div className="mr-10">
                  <LikeButton songId={song.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularSong;