import React, { useState, useEffect, useContext } from "react";
import { getSongs } from "services/songs";
import useAge from "../calculateAge";
import { PlayerContext } from "../context/MusicPlayer";
import { handleWarning } from "../notification";

const GridItems = () => {
  const [Songs, setSongs] = useState([]);
  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();

  const SongData = async () => {
    const data = await getSongs();
    setSongs(data.songs || []);
  };


  useEffect(() => {
    SongData();
  }, []);

  const handleRowClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    } else {
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
        is_premium: song.is_premium,
        artistID: song.artistID
      });

      setClickedIndex(index);
      try {
        localStorage.setItem("songs", JSON.stringify(Songs));
      } catch (error) {
        console.error("Error saving songs to localStorage:", error);
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {Songs.slice(0, 6).map((song, index) => (
        <div
          key={index}
          className={`relative rounded-md cursor-pointer
          ${clickedIndex === index ? "bg-gray-600" : "bg-zinc-900 hover:bg-zinc-700"}`}
          onClick={() => handleRowClick(song, index)}
        >
          <img
            src={song.image}
            alt={song.title}
            className="w-20 h-20 object-cover rounded-l-md"
          />
          <div className="absolute top-1/2 left-20 transform -translate-y-1/2 text-white p-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-[300px]">
            <div className="flex items-center">
              <p className="text-sm font-semibold overflow-hidden text-ellipsis">
                {song.title}
              </p>
              {song.is_premium === 1 && (
                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-2 shrink-0">
                  PREMIUM
                </span>
              )}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default GridItems;
