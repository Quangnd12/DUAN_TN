
import React, {useState,useContext} from "react";
import useAge from "../../calculateAge";
import { PlayerContext } from "../../context/MusicPlayer";
import { formatDuration } from "../../format";
import { handleWarning } from "../../notification";

const PlaylistTab = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const popularSongsList = JSON.parse(localStorage.getItem("songs"));

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
        TotalDuration:song.duration,
        songId:song.id,
        is_premium:song.is_premium,
        artistID:song.artistID
      });
      setClickedIndex(index);
      try {
        localStorage.setItem("songs", JSON.stringify(popularSongsList));
      } catch (error) {
        console.error("Error saving songs to localStorage:", error);
      }
    }
  };

  return (
    <div className="p-4">
      {popularSongsList.map((song, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            handleRowClick(song);
            setClickedIndex(index);
          }}
          className={`items-center p-1 rounded-md transition-colors ${
                   hoveredIndex === index || clickedIndex === index
                     ? "bg-gray-700"
                     : ""
                 } `}
        >
          <div key={song.id} className="flex items-center justify-between py-2 ">
            {/* Hình ảnh nằm bên trái */}
            <div className="flex items-center">
              <img
                src={song.image}
                alt={song.title}
                className="w-12 h-12 rounded mr-4" // Kích thước hình ảnh và margin-right
              />
              <div>
                <h3 className="text-white text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[150px]">
                  {song.title}
                </h3>{" "}
                {/* Tên bài hát lớn và đậm */}
                <p className="text-gray-400 text-xs">{song.artist}</p>{" "}
              </div>
            </div>
            {/* Thời lượng bài hát nằm phía cuối bên phải */}
            <span className="text-gray-400 text-xs"> {formatDuration(song.duration)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistTab;
