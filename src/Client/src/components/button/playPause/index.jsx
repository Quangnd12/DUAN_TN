import React, { useEffect } from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const PlayPause = ({
  rowId,
  index,
  globalPlayingState,
  setGlobalPlayingState,
}) => {
  const sky = getComputedStyle(document.documentElement)
    .getPropertyValue("--sky")
    .trim();

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      globalPlayingState.rowId === rowId &&
      globalPlayingState.index === index
    ) {
      setGlobalPlayingState({ rowId: null, index: null });
    } else {
      setGlobalPlayingState({ rowId, index });
    }
  };

  useEffect(() => {
    // Lưu trạng thái vào localStorage mỗi khi globalPlayingState thay đổi
    localStorage.setItem(
      "globalPlayingState",
      JSON.stringify(globalPlayingState)
    );
  }, [globalPlayingState]);

  return (
    <div
      className={`absolute top-20 -right-2 mb-2 mr-2 transition-opacity ${
        globalPlayingState.rowId === rowId && globalPlayingState.index === index
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
      }`}
      onClick={handleIconClick}
    >
      {globalPlayingState.rowId === rowId &&
      globalPlayingState.index === index ? (
        <PauseCircleIcon
          fontSize="large"
          sx={{ color: sky, cursor: "pointer", background: "white", borderRadius: 100 }}
        />
      ) : (
        <PlayCircleIcon
          fontSize="large"
          sx={{ color: sky, cursor: "pointer", background: "white", borderRadius: 100 }}
        />
      )}
    </div>
  );
};

export default PlayPause;
