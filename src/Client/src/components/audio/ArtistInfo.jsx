import React, { useState, useEffect, useRef } from "react";
import Marquee from "react-fast-marquee";
import "../../assets/css/artist/artist.css";
import LikeButton from "../button/favorite";
import MoreButton from "../button/morePlaycontroll";

export default function ArtistInfo({
  title,
  image,
  artist,
  lyrics,
  user_id,
  is_premium,
}) {
  const [likedSongs, setLikedSongs] = useState({});

  const handleLikeToggle = (index) => {
    setLikedSongs((prevLikedSongs) => ({
      ...prevLikedSongs,
      [index]: !prevLikedSongs[index],
    }));
  };

  const shouldUseMarquee = title && title.length > 35;

  const handleOptionSelect = (action) => {
    console.log("Selected action:", action);
    // Xử lý action tại đây
  };

  return (
    <div className="track">
      <div className="track__image">
        <img src={image} alt={title} />
      </div>
      <div className="track__info">
        <div style={{ width: "280px", display: "flex", alignItems: "center" }}>
          {shouldUseMarquee ? (
            <Marquee style={{ width: "100%" }} gap={0}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4 className="track__info__track__name">{title}</h4>
                {is_premium === 1 && (
                  <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-2 shrink-0 mr-2">
                    PREMIUM
                  </span>
                )}
              </div>
            </Marquee>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <h4 className="track__info__track__name">{title}</h4>
              {is_premium === 1 && (
                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-2 shrink-0 mr-2">
                  PREMIUM
                </span>
              )}
            </div>
          )}
        </div>
        <h6 className="track__info__track__artists whitespace-nowrap overflow-hidden text-ellipsis w-[280px]">
          {artist || ""}
        </h6>
      </div>
      <div className="track__info__like">
        <LikeButton
          likedSongs={likedSongs[0]}
          handleLikeToggle={() => handleLikeToggle(0)}
        />
      </div>
      <div className="track__info__more">
        <MoreButton
          type="songPlay"
          onOptionSelect={handleOptionSelect}
          songImage={image}
          songTitle={title}
          artistName={artist}
          lyrics={lyrics}
          user_id={user_id}
        />
      </div>
    </div>
  );
}
