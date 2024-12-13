import React, { useState, useEffect, useContext } from "react";
import Rowlib from "../../components/rowlibrary/rowlib";
import Footer from "../../components/footer/Footer";
import SongItem from "../../components/dropdown/dropdownMenu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MdCheckBoxOutlineBlank, MdCheck, MdFavorite, MdFavoriteBorder, MdMoreVert, MdMusicNote } from "react-icons/md";
import MoreButton from "../../components/button/more";
import { getArtists } from "../../../../services/artist";
import { getSongs } from "../../../../services/songs";
import { PlayerContext } from "../../components/context/MusicPlayer";
import { Link } from "react-router-dom";
import { slugify } from "../../components/createSlug";
import LikeButton from "../../components/button/favorite";
import useAge from "../../components/calculateAge";
import { handleWarning } from "../../components/notification";
import { formatDuration } from "Admin/src/components/formatDate";

const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Library = () => {
  const [artists, setArtists] = useState([]);
  const [displayedArtists, setDisplayedArtists] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const { setPlayerState, clickedIndex, setClickedIndex, isPlaying, setIsPlaying } = useContext(PlayerContext);
  const age = useAge();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch artists
        const artistsResponse = await getArtists(1, 10);
        if (artistsResponse.artists) {
          const formattedArtists = artistsResponse.artists.map(artist => ({
            id: artist._id,
            name: artist.name,
            image: artist.avatar || "https://th.bing.com/th/id/OIP.fLnk_eILwplVquL4wn3t2gHaHa?rs=1&pid=ImgDetMain",
            monthlyListeners: artist.monthly_listeners || 0,
            followers: artist.followers || 0
          }));
          setArtists(formattedArtists);
          setDisplayedArtists(formattedArtists.slice(0, 5));
        }

        // Fetch songs và lấy 5 bài ngẫu nhiên
        const songsResponse = await getSongs(1, 100); // Lấy nhiều bài hơn để có thể random
        if (songsResponse.songs) {
          const formattedSongs = songsResponse.songs
            // Lọc bỏ bài premium và explicit
            .filter(song => song.is_premium === 0 && song.is_explicit === 0)
            .map(song => ({
              id: song._id,
              title: song.title,
              duration: song.duration,
              image: song.image,
              artist: song.artist?.name || "",
              file_song: song.file_song,
              lyrics: song.lyrics,
              album: song.album?.name || "",
              listens_count: song.listens_count,
              is_premium: song.is_premium,
              is_explicit: song.is_explicit
            }));
            
          // Lấy 5 bài ngẫu nhiên từ danh sách đã lọc
          const randomSongs = getRandomItems(formattedSongs, 5);
          setFavoriteSongs(randomSongs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      album: song.album,
      playCount: song.listens_count,
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium
    });
    setClickedIndex(index);
    setIsPlaying(true);

    try {
      localStorage.setItem("songs", JSON.stringify(favoriteSongs));
    } catch (error) {
      console.error("Error saving songs to localStorage:", error);
    }
  };

  // Thêm nút refresh để lấy 5 bài hát ngẫu nhiên mới
  const handleRefreshSongs = async () => {
    try {
      const songsResponse = await getSongs(1, 100);
      if (songsResponse.songs) {
        const formattedSongs = songsResponse.songs
          .filter(song => song.is_premium === 0 && song.is_explicit === 0)
          .map(song => ({
            id: song._id,
            title: song.title,
            duration: song.duration,
            image: song.image,
            artist: song.artist?.name || "",
            file_song: song.file_song,
            lyrics: song.lyrics,
            album: song.album?.name || "",
            listens_count: song.listens_count,
            is_premium: song.is_premium,
            is_explicit: song.is_explicit
          }));
          
        const randomSongs = getRandomItems(formattedSongs, 5);
        setFavoriteSongs(randomSongs);
      }
    } catch (error) {
      console.error("Error refreshing songs:", error);
    }
  };

  return (
    <HelmetProvider>
      <div className="text-gray-100 min-h-screen p-6">
        <Helmet>
          <title>Library</title>
          <meta name="description" content="This is the library page of our music app." />
        </Helmet>

        {/* Artists Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Artists</h2>
            <Link
              to="/show-all/artist"
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4">
            {displayedArtists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artist/${slugify(artist.name)}`}
                className="flex-shrink-0 w-[180px] group"
              >
                <div className="text-center">
                  <div className="relative mb-4">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-[180px] h-[180px] object-cover rounded-full"
                    />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-blue-500 truncate px-2">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Artist</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="my-6 border-t border-gray-700/50"></div>

        {/* Favorite Songs Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Favorite Songs</h2>
            <button 
              onClick={handleRefreshSongs}
              className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {favoriteSongs.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-300
                  ${hoveredIndex === index && "bg-gray-700/50"}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleRowClick(song, index)}
              >
                <div className="flex items-center gap-4">
                  {/* Số thứ tự */}
                  <div className="w-8 text-center">
                    <span className={`text-gray-400 ${hoveredIndex === index && "hidden"}`}>
                      {index + 1}
                    </span>
                    {hoveredIndex === index && (
                      <button className="text-white hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Ảnh và thông tin bài hát */}
                  <img 
                    src={song.image} 
                    alt={song.title} 
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-semibold text-white">
                        {song.title}
                      </p>
                      {song.is_premium === 1 && (
                        <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-2">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                </div>

                {/* Phần bên phải */}
                {hoveredIndex === index ? (
                  <div className="flex items-center gap-3">
                    <LikeButton songId={song.id} />
                    <MoreButton
                      type="song"
                      index={index}
                      dropdownIndex={dropdownIndex}
                      handleDropdownToggle={(e) => {
                        e.stopPropagation();
                        setDropdownIndex(index === dropdownIndex ? null : index);
                      }}
                      align="right"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">
                    {formatDuration(song.duration)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Library;
