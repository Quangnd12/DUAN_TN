import React, { useState, useEffect, useRef } from "react";
import Marquee from "react-fast-marquee";
import "../../assets/css/artist/artist.css";
import LikeButton from "../button/favorite";
import MoreButton from "../button/morePlaycontroll";


export default function ArtistInfo({ title, image, artist,lyrics,user_id }) {
  const [likedSongs, setLikedSongs] = useState({});


  const handleLikeToggle = (index) => {
    setLikedSongs((prevLikedSongs) => ({
      ...prevLikedSongs,
      [index]: !prevLikedSongs[index],
    }));
  };

  const shouldUseMarquee =title && title.length > 35;

  const handleOptionSelect = (action) => {
    console.log('Selected action:', action);
    // Xử lý action tại đây
  };

  return (
    <div className="track">
      <div className="track__image">
        <img src={image} alt={title} />
      </div>
      <div className="track__info">
        <div style={{ width: '280px' }}>
          {shouldUseMarquee ? (
            <Marquee style={{ width: '100%' }} gap={0}>
              <h4 className="track__info__track__name">{title}</h4>
            </Marquee>
          ) : (
            <h4 className="track__info__track__name">{title}</h4>
          )}
        </div>
        <h6 className="track__info__track__artists whitespace-nowrap overflow-hidden text-ellipsis w-[280px]">{artist || ''}</h6>
      </div>
      <div className="track__info__like">
        <LikeButton
          likedSongs={likedSongs[0]}
          handleLikeToggle={() => handleLikeToggle(0)}
        />
      </div>
      <div className="track__info__more">
        <MoreButton type="songPlay"
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
