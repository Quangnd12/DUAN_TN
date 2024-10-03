import React, {useState} from "react";
import data from "../../../data/fetchSongData";


const RecentlyPlayedTab = () => {

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  // const [selectedPlayer, setSelectedPlayer] = useState(null);
  const popularSongsList = data.songs.slice(0, 7);

  // const handleRowClick = (song) => {
  //   setSelectedPlayer(song);
  // };

  return (
    <div className="p-4">
      {popularSongsList.map((song, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            // handleRowClick(song);
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
                <h3 className="text-white text-base font-semibold">
                  {song.name}
                </h3>{" "}
                {/* Tên bài hát lớn và đậm */}
                <p className="text-gray-400 text-xs">{song.artist}</p>{" "}
                {/* Tên nghệ sĩ màu xám và nhỏ */}
              </div>
            </div>
            {/* Thời lượng bài hát nằm phía cuối bên phải */}
            <span className="text-gray-400 text-xs">{song.duration}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentlyPlayedTab;