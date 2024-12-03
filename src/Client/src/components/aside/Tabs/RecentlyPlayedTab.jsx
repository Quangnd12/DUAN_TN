import React, { useEffect, useState,useContext } from "react";
import { getHistoryById,deleteHistory,deleteAllHistory } from "services/history";
import { useDispatch, useSelector } from "react-redux";
import useAge from "../../calculateAge";
import { PlayerContext } from "../../context/MusicPlayer";
import { handleWarning } from "../../notification";
import { formatDuration } from "../../format";
import MoreButton from "../../button/more";
import { FaTrash } from "react-icons/fa";


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
      setHistories(data);
    }
  }
  const deleteSong = async (songId) => {
    try {
      if (user) {
        await deleteHistory(songId);
        await HistorySong();
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài hát:", error);
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

  const handleOptionSelect = async (action) => {
    if (action === 'delete_all') {
        try {
            await deleteAllHistory(user_id);
            await HistorySong();
        } catch (error) {
            console.error("Lỗi khi xóa tất cả lịch sử:", error);
        }
    }
  };

  return (
    <div className="p-4 relative">
      <MoreButton type="history" onOptionSelect={handleOptionSelect} />
      {Array.isArray(histories) && histories.length > 0 ? (
        <>
          {histories.map((history, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                handleRowClick(history, index);
                setClickedIndex(index);
              }}
              className={`items-center p-1 rounded-md transition-colors relative ${
                hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""
              }`}
            >
              <div key={history.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <img
                    src={history.image}
                    alt={history.title}
                    className="w-12 h-12 rounded mr-4"
                  />
                  <div>
                    <h3 className="text-white text-base font-semibold">
                      {history.title}
                    </h3>
                    <p className="text-gray-400 text-xs">{history.artist}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 text-xs mr-4">
                    {formatDuration(history.duration)}
                  </span>
                  {hoveredIndex === index && (
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSong(history.id);
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-gray-400 text-sm">No history available.</p>
      )}
    </div>
  );    
};

export default RecentlyPlayedTab;
