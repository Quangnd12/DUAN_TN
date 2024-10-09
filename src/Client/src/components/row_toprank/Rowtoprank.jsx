import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import CircleCard from "../cards/CircleCard";
import RoundCard from "../cards/RoundCard";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const RowToprank = ({ title, data, rowId, globalPlayingState, setGlobalPlayingState }) => {
  const sky = getComputedStyle(document.documentElement).getPropertyValue("--sky").trim();

  useEffect(() => {
    // Lưu trạng thái vào localStorage mỗi khi globalPlayingState thay đổi
    localStorage.setItem('globalPlayingState', JSON.stringify(globalPlayingState));
  }, [globalPlayingState]);

  const handleIconClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (globalPlayingState.rowId === rowId && globalPlayingState.index === index) {
      setGlobalPlayingState({ rowId: null, index: null });
    } else {
      setGlobalPlayingState({ rowId, index });
    }
  };

  const renderCard = (item, index) => (
    <div key={item.id || index} className="relative group"> {/* Sử dụng item.id làm key */}
      <Link to={`/toprank/${item.id}`}>
        <RoundCard
          image={item.image}
          name={item.song}  {/* Sử dụng tên bài hát */}
          title={item.artist} {/* Sử dụng tên nghệ sĩ */}
        />
      </Link>
      <div
        className={`absolute top-20 -right-2 mb-2 mr-2 transition-opacity ${globalPlayingState.rowId === rowId && globalPlayingState.index === index
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100'
          }`}
        onClick={(e) => handleIconClick(e, index)}
      >
        {globalPlayingState.rowId === rowId && globalPlayingState.index === index ? (
          <PauseCircleIcon
            fontSize="large"
            sx={{ color: sky, cursor: 'pointer' }}
          />
        ) : (
          <PlayCircleIcon
            fontSize="large"
            sx={{ color: sky, cursor: 'pointer' }}
          />
        )}
      </div>
    </div>
  );


  const artistItems = data.filter(item => item.title === "Artist");
  const otherItems = data.filter(item => item.title !== "Artist");

  const getShowAllLink = () => {
    if (title.toLowerCase().includes("artist")) {
      return "/artist";
    } else if (title.toLowerCase().includes("album")) {
      return "/allalbum";
    } else {
      return "/allsong";
    }
  };

  return (
    <div className="flex flex-col p-4 bg-zinc-900 rounded-md">
      <div className="flex justify-between mb-4">
        <h2 className="rowItemTitle">{title}</h2>
        <Link
          to={getShowAllLink()}
          className="rowItemSubTitle text-sky-500 font-bold cursor-pointer hover:text-white"
        >
          Show all
        </Link>
      </div>
      <div className="flex justify-between">
        {artistItems.map((item, index) => renderCard(item, index, true))}
        {otherItems.map((item, index) => renderCard(item, index + artistItems.length, false))}
      </div>
    </div>
  );
};

export default RowToprank;