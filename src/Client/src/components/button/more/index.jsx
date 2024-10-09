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
import ShareOptions from '../share';
import ShareOptionsList from '../share-list/share-list';
import { handleAddFavorite, handleAddPlaylist, handleAddWaitlist, handleAddLibrary } from "../../notification";
import EditIcon from '@mui/icons-material/Edit';




const MoreButton = ({ type, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const dropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);

    const menuOptions = {
        albumPlaylist: [
            { label: 'Add to library', action: 'add_to_library', icon: <LibraryAddIcon /> },
            { label: 'Add to waiting list', action: 'waiting_list', icon: <QueueMusicIcon /> },
            { label: 'Jump to radio by artist', action: 'go_to_radio', icon: <RadioIcon /> },
            { label: 'Add to playlist', action: 'add_to_playlist', icon: <PlaylistAddIcon /> },
            { label: 'Share', action: 'share', icon: <ShareIcon /> },
        ],
        track: [
            { label: 'Add to playlist', action: 'add_to_playlist', icon: <PlaylistAddIcon /> },
            { label: 'Save to Your Liked Songs', action: 'save_to_liked_songs', icon: <FavoriteIcon /> },
            { label: 'Add to waiting list', action: 'add_to_queue', icon: <QueueMusicIcon /> },
            { label: 'Go to the radio by song', action: 'go_to_song_radio', icon: <RadioIcon /> },
            { label: 'Go to artist', action: 'go_to_artist', icon: <PersonIcon /> },
            { label: 'Go to album', action: 'go_to_album', icon: <AlbumIcon /> },
            { label: 'View attribution information', action: 'view_credits', icon: <InfoIcon /> },
            { label: 'Share', action: 'share', icon: <ShareIcon /> },
        ],
        artist: [
            { label: 'Theo dõi', action: 'follow', icon: <PersonAddIcon /> },
            { label: 'Không phát nghệ sĩ này', action: 'dont_play_this_artist', icon: <BlockIcon /> },
            { label: 'Chuyển đến radio theo nghệ sĩ', action: 'go_to_artist_radio', icon: <RadioIcon /> },
            { label: 'Báo cáo', action: 'report', icon: <ReportIcon /> },
            { label: 'Chia sẻ', action: 'share', icon: <ShareIcon /> },
        ],
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target)) {
                setIsShareOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (action) => {
        if (action === 'share') {
            setIsShareOpen((prev) => !prev);
        } else {
            onOptionSelect(action);
            setIsOpen(false);
        }
    };

    const handleNotification = (action) => {
        switch (action) {
            case 'add_to_playlist':
                handleAddPlaylist();
                break;
            case 'add_to_library':
                handleAddLibrary();
                break;
            case 'waiting_list':
                handleAddWaitlist();
                break;
            default:
                console.log("Action not handled:", action);
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const dropdownStyle = (e) => {
        const dropdownHeight = 200;
        const spaceBelow = window.innerHeight - e.currentTarget.getBoundingClientRect().bottom;

        if (spaceBelow < dropdownHeight) {
            return { top: 'auto', bottom: '100%', marginBottom: '8px' };
        }

        return { top: '100%', marginTop: '8px' };
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <MdMoreHoriz
                className="text-white cursor-pointer hover:text-gray-500"
                size={24}
                onClick={toggleDropdown}
            />
            {isOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-md z-50 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                    style={dropdownStyle({ currentTarget: dropdownRef.current })}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {menuOptions[type].map((option, index) => (
                            <div key={index}>
                                <button
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm rounded-sm 
                                    ${option.action === 'share' && isShareOpen ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    role="menuitem"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(option.action);
                                        handleNotification(option.action);
                                    }}
                                    onMouseEnter={() => {
                                        if (option.action === 'share') {
                                            setIsShareOpen(true);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (option.action === 'share') {
                                            setIsShareOpen(false);
                                        }
                                    }}
                                >
                                    <span className="mr-3">{option.icon}</span>
                                    {option.label}
                                </button>
                                {isShareOpen && option.action === 'share' && (
                                    <div
                                        ref={shareDropdownRef}
                                        onMouseEnter={() => setIsShareOpen(true)}
                                        onMouseLeave={() => {
                                            setIsShareOpen(false);
                                        }}
                                    >
                                        {type === 'albumPlaylist' ? (
                                            <ShareOptionsList onOptionClick={handleOptionClick} />
                                        ) : (
                                            <ShareOptions onOptionClick={handleOptionClick} />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export default MoreButton;


