import React, { useState, useRef, useEffect } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import RadioIcon from '@mui/icons-material/Radio';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import AlbumIcon from '@mui/icons-material/Album';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';

// New SongMoreButton component
const SongMoreButton = ({ onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const songMenuOptions = [
        { label: 'Thêm vào danh sách phát', action: 'add_to_playlist', icon: <AddIcon /> },
        { label: 'Lưu vào bài hát đã thích của bạn', action: 'favorite_songs', icon: <AddCircleOutlineIcon /> },
        { label: 'Thêm vào danh sách chờ', action: 'waiting_list', icon: <PlaylistAddIcon /> },
        { label: 'Chuyển đến radio theo bài hát', action: 'go_to_song_radio', icon: <RadioIcon /> },
        { label: 'Chuyển tới nghệ sĩ', action: 'go_to_artist', icon: <PersonIcon /> },
        { label: 'Chuyển tới album', action: 'go_to_album', icon: <AlbumIcon /> },
        { label: 'Xem thông tin ghi công', action: 'attribution_information', icon: <FeaturedPlayListIcon /> },
        { label: 'Chia sẻ', action: 'share', icon: <ShareIcon /> },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (action) => {
        onOptionSelect(action);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <MdMoreHoriz
                className="text-white cursor-pointer hover:text-gray-500"
                size={24}
                onClick={toggleDropdown}
            />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-md z-50 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {songMenuOptions.map((option, index) => (
                            <button
                                key={index}
                                className="flex items-center w-full text-left px-4 py-2 text-sm rounded-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                role="menuitem"
                                onClick={() => handleOptionClick(option.action)}
                            >
                                <span className="mr-3">{option.icon}</span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export default SongMoreButton