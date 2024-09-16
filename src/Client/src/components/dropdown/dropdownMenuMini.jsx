import React, { useEffect } from 'react';
import { MdPlaylistAdd, MdLink, MdShare } from 'react-icons/md';
import { FaCode } from 'react-icons/fa';
import { handleAddPlaylist } from '../notification';

const SongDropdown = ({
    index,
    dropdownIndex,
    dropdownRefs,
    setShowShareOptions,
    showShareOptions,
    align
}) => {
    

    if (dropdownIndex !== index) return null;

    const handleEmbedCode = (e) => {
        e.stopPropagation();
    }
    const handleCopyLink = (e) => {
        e.stopPropagation();
    }
    const handleAddPlayLists = (e) => {
        e.stopPropagation();
        handleAddPlaylist();
    }

    return (
        <div ref={(el) => (dropdownRefs.current[index] = el)} className={`dropdown ${align === "right" ? "right-aligned" : "left-aligned"}`}>
            <button className="dropdown-button"
                onClick={handleAddPlayLists}>
                <MdPlaylistAdd size={20} />
                <span>Add to Playlist</span>
            </button>
            <button className="dropdown-button"
                onClick={handleCopyLink}>
                <MdLink size={20} />
                <span>Copy Link</span>
            </button>
            <button
                className="dropdown-button relative"
                onMouseEnter={() => setShowShareOptions(true)}
                onMouseLeave={() => setShowShareOptions(false)}
            >
                <MdShare size={18} />
                <span>Share</span>
                {showShareOptions && (
                    <div className="share-options">
                        <a href="https://facebook.com" className="dropdown-button">
                            <img src={"/images/logo/facebook.jpg"} alt="Facebook" className="w-5 h-5 rounded-sm" />
                            <span>Facebook</span>
                        </a>
                        <a href="https://zalo.me" className="dropdown-button">
                            <img src={"/images/logo/zalo.webp"} alt="Zalo" className="w-5 h-5" />
                            <span>Zalo</span>
                        </a>
                        <button className="dropdown-button"
                            onClick={handleEmbedCode}>
                            <FaCode size={18} />
                            <span>Embed Code</span>
                        </button>
                    </div>
                )}
            </button>
        </div>
    );
};

export default SongDropdown;
