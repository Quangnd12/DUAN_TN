import React, { useState } from "react";
import { MdPlayArrow } from "react-icons/md";
import LikeButton from "../button/favorite";
import MoreButton from "../button/more";
import "../../assets/css/artist/visualizer.css";

const AlbumHover = ({ onPlayClick, isPlaying, show, isClicked }) => { 
    const [likedSongs, setLikedSongs] = useState({});

    const handleLikeToggle = (index) => {
        setLikedSongs((prevLikedSongs) => ({
            ...prevLikedSongs,
            [index]: !prevLikedSongs[index],
        }));
    };

    const handleOptionSelect = (action, e) => {
        e.stopPropagation();
        console.log('Selected action:', action);
    };

    const handlePlayClick = (e) => {
        e.stopPropagation(); 
        onPlayClick();
    };

    // Kiểm tra nếu album được click hoặc đang hover
    if (!show && !isClicked) return null; 

    return (
        <div className="absolute left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center items-center opacity-100 transition-opacity duration-300">
            <div className="flex justify-center space-x-6">
                <button className="text-white hover:text-red-500">
                    <LikeButton
                        likedSongs={likedSongs[0]}
                        handleLikeToggle={() => handleLikeToggle(0)}
                    />
                </button>
                <button
                    className="bg-[#09A6EF] text-white p-2 rounded-full transition ml-3 flex items-center justify-center"
                    onClick={handlePlayClick} 
                    style={{ width: '45px', height: '45px' }}
                >
                    {isPlaying ? (
                        <div className="visualizer flex items-center">
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                    ) : (
                        <MdPlayArrow size={28} />
                    )}
                </button>
                <button>
                    <MoreButton type="albumPlaylist" onOptionSelect={handleOptionSelect} />
                </button>
            </div>
        </div>
    );
};

export default AlbumHover;
