import React from "react";
import "../../assets/css/artist/artist.css";
import LikeButton from "../button/favorite";
import SongMoreButton from "../button/moreSong";

const SongItem = ({ song, songId, ...props }) => {
  if (!song) {
    return null;
  }

  const handleSongOptionSelect = (action) => {
    console.log("Selected action:", action);
  };

  return (
    <>
      {props.hoveredIndex === props.index && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-4 z-10">
          <LikeButton songId={songId} />
          <div className="relative">
            <SongMoreButton type={props.type} songId={song.id} onOptionSelect={handleSongOptionSelect} />
          </div>
        </div>
      )}
    </>
  );
};

export default SongItem;
