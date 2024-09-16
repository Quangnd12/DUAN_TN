import React, { useEffect } from 'react';
import "../../assets/css/artist/artist.css";
import LikeButton from '../button/favorite';
import MoreButton from '../button/more';

const SongItem = ({
    index,
    hoveredIndex,
    likedSongs,
    handleLikeToggle,
}) => {

    return (
        <>
            {hoveredIndex === index && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
                    <LikeButton
                        likedSongs={likedSongs[index]} 
                        handleLikeToggle={() => handleLikeToggle(index)} 
                    />                
                    <MoreButton
                     
                    />
                </div>
            )}
        </>
    );
};

export default SongItem;
