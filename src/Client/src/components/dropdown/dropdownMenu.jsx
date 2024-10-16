import React from "react";
import "../../assets/css/artist/artist.css";
import LikeButton from "../button/favorite";
import SongMoreButton from "../button/moreSong";

const SongItem = ({ index, hoveredIndex, likedSongs, handleLikeToggle ,type}) => {
  const handleSongOptionSelect = (action) => {
    console.log("Selected action:", action);
  };

  return (
    <>
      {hoveredIndex === index && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-4 z-10">
          <LikeButton
            likedSongs={likedSongs[index]}
            handleLikeToggle={() => handleLikeToggle(index)}
          />
          <div className="relative ">
            <SongMoreButton type={type} onOptionSelect={handleSongOptionSelect} />
          </div>
        </div>
      )}
    </>
  );
};

export default SongItem;
