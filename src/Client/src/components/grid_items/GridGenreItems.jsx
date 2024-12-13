import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "services/genres";
import GenreCard from "../../components/grid_items/GenreCard";
import { getSongs } from "services/songs";
import { PlayerContext } from "../context/MusicPlayer";
import useAge from "Client/src/components/calculateAge";
import { handleWarning, handleWarningUser } from "Client/src/components/notification";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GridGenreItems = () => {
  const [genres, setGenres] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const { setPlayerState, Songs, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const GenreData = async () => {
    const data = await getGenres();
    setGenres(data.genres || []);
  };

  const fetchTopSongs = async () => {
    try {
      const response = await getSongs();
      if (response && response.songs) {
        const processedSongs = response.songs.map(song => ({
          ...song,
          id: song.id || song._id,
          _id: song._id || song.id,
          listens_count: parseInt(song.listens_count) || 0
        }));

        const sortedSongs = processedSongs
          .sort((a, b) => b.listens_count - a.listens_count)
          .slice(0, 5);

        sortedSongs.forEach(song => {
          const existingIndex = Songs.findIndex(s => s._id === song._id || s.id === song.id);
          if (existingIndex === -1) {
            Songs.push(song);
          } else {
            Songs[existingIndex] = song;
          }
        });

        setTopSongs(sortedSongs);
      }
    } catch (error) {
      console.error('Lỗi khi lấy top bài hát:', error);
      setTopSongs([]);
    }
  };

  const handleSongClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      return;
    }

    if (!user && song.is_premium === 1) {
      handleWarningUser();
      navigate("/login");
      return;
    }

    const songIndex = Songs.findIndex(s => 
      (s._id === song._id || s._id === song.id) || 
      (s.id === song._id || s.id === song.id)
    );
    
    if (songIndex !== -1) {
      const currentSong = Songs[songIndex];
      setPlayerState({
        audioUrl: currentSong.file_song,
        title: currentSong.title,
        artist: currentSong.artist,
        Image: currentSong.image,
        lyrics: currentSong.lyrics,
        album: currentSong.album || currentSong.title,
        playCount: currentSong.listens_count,
        TotalDuration: currentSong.duration,
        songId: currentSong.id || currentSong._id,
        is_premium: currentSong.is_premium,
        is_explicit: currentSong.is_explicit
      });
      setClickedIndex(songIndex);

      try {
        localStorage.setItem("songs", JSON.stringify(Songs));
      } catch (error) {
        console.error("Error saving songs to localStorage:", error);
      }
    }
  };

  const formatListens = (listens) => {
    if (listens >= 1000000) {
      return `${(listens / 1000000).toFixed(1)}M`;
    } else if (listens >= 1000) {
      return `${(listens / 1000).toFixed(1)}K`;
    }
    return listens;
  };

  useEffect(() => {
    GenreData();
    fetchTopSongs();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="bg-zinc-900 p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-left font-bold text-white">Genres</h2>
          <Link to="/genre" className="text-sm text-gray-400 hover:text-white">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-zinc-900">
          {genres.slice(0, 6).map((genre, index) => (
            <GenreCard key={index} genre={genre} />
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-left font-bold text-white">Top Charts</h2>
          <Link to="/toprank" className="text-sm text-gray-400 hover:text-white">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {topSongs.map((song, index) => (
            <div
              key={song._id}
              className={`flex items-center justify-between text-white hover:bg-zinc-800 p-2 rounded-md cursor-pointer
                ${song.is_explicit === 1 && age < 18 ? 'opacity-50' : ''}
                ${song.is_premium === 1 && !user ? 'opacity-50' : ''}`}
              onClick={() => handleSongClick(song, index)}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-gray-400 w-6 font-bold ${index < 3 ? 'text-blue-500' : ''}`}>
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <img
                  src={song.image || "default-image-url"}
                  alt={song.title}
                  className="w-10 h-10 rounded"
                />
                <div>
                  <p className="font-medium text-white flex items-center">
                    {song.title}
                    {song.is_explicit === 1 && (
                      <span className="ml-2 text-red-500 text-xs">Explicit</span>
                    )}
                    {song.is_premium === 1 && (
                      <span className="ml-2 text-yellow-500 text-xs">Premium</span>
                    )}
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>{song.artist}</span>
                    <span className="mx-2">•</span>
                    <span>{formatListens(song.listens_count)} lượt nghe</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridGenreItems;
