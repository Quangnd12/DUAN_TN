import React, { useState, useRef, useEffect } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import RadioIcon from '@mui/icons-material/Radio';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import AlbumIcon from '@mui/icons-material/Album';
import InfoIcon from '@mui/icons-material/Info';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';



const MoreButton = ({ type, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const menuOptions = {
        albumPlaylist: [
            { label: 'Thêm vào Thư viện', action: 'add_to_library', icon: <LibraryAddIcon /> },
            { label: 'Thêm vào danh sách chờ', action: 'add_to_queue', icon: <QueueMusicIcon /> },
            { label: 'Chuyển đến radio theo nghệ sĩ', action: 'go_to_radio', icon: <RadioIcon /> },
            { label: 'Thêm vào danh sách phát', action: 'add_to_playlist', icon: <PlaylistAddIcon /> },
            { label: 'Chia sẻ', action: 'share', icon: <ShareIcon /> },
        ],
        track: [
            { label: 'Thêm vào danh sách phát', action: 'add_to_playlist', icon: <PlaylistAddIcon /> },
            { label: 'Lưu vào Bài hát đã thích của bạn', action: 'save_to_liked_songs', icon: <FavoriteIcon /> },
            { label: 'Thêm vào danh sách chờ', action: 'add_to_queue', icon: <QueueMusicIcon /> },
            { label: 'Chuyển đến radio theo bài hát', action: 'go_to_song_radio', icon: <RadioIcon /> },
            { label: 'Chuyển tới nghệ sĩ', action: 'go_to_artist', icon: <PersonIcon /> },
            { label: 'Chuyển đến album', action: 'go_to_album', icon: <AlbumIcon /> },
            { label: 'Xem thông tin ghi công', action: 'view_credits', icon: <InfoIcon /> },
            { label: 'Chia sẻ', action: 'share', icon: <ShareIcon /> },
        ],
        artist: [
            { label: 'Theo dõi', action: 'follow', icon: <PersonAddIcon /> },
            { label: 'Không phát nghệ sĩ này', action: 'dont_play_this_artist', icon: <BlockIcon /> },
            { label: 'Chuyển đến radio theo nghệ sĩ', action: 'go_to_artist_radio', icon: <RadioIcon /> },
            { label: 'Báo cáo', action: 'report', icon: <ReportIcon /> },
            { label: 'Chia sẻ', action: 'share', icon: <ShareIcon /> },
        ],
        lyrics: [
            { label: 'Theo dõi', action: 'follow', icon: <PersonAddIcon /> },
         
            { label: 'Chia sẻ', action: 'share', icon: <ShareIcon /> },
            
            
        ],
    };

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
                <div className="absolute left-0 mt-2 w-72 rounded-md z-50 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {menuOptions[type].map((option, index) => (
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

export default MoreButton;