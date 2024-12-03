import React, { useEffect, useState,useContext } from "react";
import { getHistoryById } from "services/history";
import { useDispatch, useSelector } from "react-redux";
import useAge from "../../calculateAge";
import { PlayerContext } from "../../context/MusicPlayer";
import { handleWarning } from "../../notification";

const RecentlyPlayedTab = () => {

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [histories, setHistories] = useState([]);
  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();
  const user=JSON.parse(localStorage.getItem('user'));
  const user_id=user.id;

  const HistorySong = async () => {
    if (user) {
      const data = await getHistoryById(user_id);
      setHistories(data.History);
    }
  }

  useEffect(() => {
    if (user) {
      HistorySong();
    }
  }, [])

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
        album: song.albumTitle,
        playCount: song.listens_count,
        TotalDuration: song.duration,
        songId: song.id,
        is_premium:song.is_premium
      });
      setClickedIndex(index);
      try {
        localStorage.setItem("songs", JSON.stringify(histories));
      } catch (error) {
        console.error("Error saving songs to localStorage:", error);
      }
    }
  };

  return (
      <div className="p-4">
        {Array.isArray(histories) && histories.length > 0 ? (
          histories.map((history, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                handleRowClick(history, index);
                setClickedIndex(index);
              }}
              className={`items-center p-1 rounded-md transition-colors ${
                hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""
              }`}
            >
              <div key={history.id} className="flex items-center justify-between py-2 ">
                <div className="flex items-center">
                  <img
                    src={history.image}
                    alt={history.title}
                    className="w-12 h-12 rounded mr-4" 
                  />
                  <div>
                    <h3 className="text-white text-base font-semibold">
                      {history.title}
                    </h3>{" "}
                    <p className="text-gray-400 text-xs">{history.artist}</p>{" "}
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{history.duration}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No history available.</p>
        )}
      </div>
    );    
};

export default RecentlyPlayedTab;