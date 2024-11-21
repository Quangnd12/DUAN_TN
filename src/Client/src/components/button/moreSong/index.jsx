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
import CancelIcon from '@mui/icons-material/Cancel';
import ShareOptions from '../share';
import { handleAddFavorite, handleAddWaitlist } from "../../notification";
import AddPlaylistOption from '../../dropdown/dropdownAddPlaylist';

const SongMoreButton = ({ type, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const dropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);
    const playlistDropdownRef = useRef(null);

    
    const songMenuOptionsMap = {
        song: [
            { label: 'Add to playlist', action: 'add_to_playlist', icon: <AddIcon /> },
            { label: 'Save to your favorite songs', action: 'favorite_songs', icon: <AddCircleOutlineIcon /> },
            { label: 'Add to waiting list', action: 'waiting_list', icon: <PlaylistAddIcon /> },
            { label: 'Jump to radio by song', action: 'go_to_song_radio', icon: <RadioIcon /> },
            { label: 'Go to artist', action: 'go_to_artist', icon: <PersonIcon /> },
            { label: 'Go to album', action: 'go_to_album', icon: <AlbumIcon /> },
            { label: 'View credit information', action: 'attribution_information', icon: <FeaturedPlayListIcon /> },
            { label: 'Share', action: 'share', icon: <ShareIcon />, isShare: true },
        ],
        playlist: [
            { label: 'Add to waiting list', action: 'waiting_list', icon: <PlaylistAddIcon /> },
            { label: 'Remove from playlist', action: 'attribution_information', icon: <CancelIcon /> },
            { label: 'Share', action: 'share', icon: <ShareIcon />, isShare: true },
        ]

    }

    const songMenuOptions = songMenuOptionsMap[type] || []; 


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsShareOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleOptionClick = (action) => {
        switch (action) {
            case 'share':
                setIsShareOpen(!isShareOpen);
                setIsOpen(!isOpen);
                break;
            case 'add_to_playlist':
                setIsPlaylistOpen(!isPlaylistOpen);
                setIsOpen(!isOpen);
                break;

            case 'favorite_songs':
                handleAddFavorite();
                setIsOpen(!isOpen);
                break;
            case 'waiting_list':
                handleAddWaitlist();
                setIsOpen(!isOpen);
                break;
            default:
                onOptionSelect(action);
                setIsOpen(false);
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
                <div
                    className="absolute right-0 w-72 rounded-md z-50 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                    style={dropdownStyle({ currentTarget: dropdownRef.current })}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {songMenuOptions.map((option, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => {
                                    if (option.action === 'share') {
                                        setIsShareOpen(true);
                                    }
                                    if (option.action === 'add_to_playlist') {
                                        setIsPlaylistOpen(true);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (option.action === 'share') {
                                        setIsShareOpen(false);
                                    }
                                    if (option.action === 'add_to_playlist') {
                                        setIsPlaylistOpen(false);
                                    }
                                }}
                            >
                                <button
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm rounded-sm 
                                  ${isShareOpen && option.action === 'share' && isShareOpen ? 'bg-gray-700' :
                                            isPlaylistOpen && option.action === 'add_to_playlist' ? 'bg-gray-700' :
                                                'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    role="menuitem"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(option.action);

                                    }}
                                >
                                    <span className="mr-3">{option.icon}</span>
                                    {option.label}
                                </button>
                                {isPlaylistOpen && option.action === 'add_to_playlist' && (
                                    <div
                                        ref={playlistDropdownRef}
                                        onMouseEnter={() => setIsPlaylistOpen(true)}
                                        onMouseLeave={() => {
                                            setIsPlaylistOpen(false);
                                        }}
                                    >
                                        <AddPlaylistOption onOptionClick={handleOptionClick} />
                                    </div>
                                )}
                                {isShareOpen && option.action === 'share' && (
                                    <div
                                        ref={shareDropdownRef}
                                        onMouseEnter={() => setIsShareOpen(true)}
                                        onMouseLeave={() => {
                                            setIsShareOpen(false);
                                        }}
                                    >
                                        <ShareOptions onOptionClick={handleOptionClick} />
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

export default SongMoreButton;
