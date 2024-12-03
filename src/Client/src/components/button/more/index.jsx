import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
import CancelIcon from '@mui/icons-material/Cancel';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AddPlaylistOption from '../../dropdown/dropdownAddPlaylist';
import { FaTrash } from "react-icons/fa";

const MoreButton = ({ type, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const dropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);
    const playlistDropdownRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const menuOptions = {
        albumPlaylist: [
            { label: 'Add to playlist', action: 'add_to_playlist', icon: <PlaylistAddIcon /> },
            { label: 'Add to waiting list', action: 'waiting_list', icon: <QueueMusicIcon /> },
            { label: 'Jump to radio by artist', action: 'go_to_radio', icon: <RadioIcon /> },
            { label: 'Add to library', action: 'add_to_library', icon: <LibraryAddIcon /> },
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
            { label: 'Remove from library', action: 'delete', icon: <CancelIcon /> },
            { label: 'Add to waiting list', action: 'waiting_list', icon: <PlaylistAddIcon /> },
            { label: 'Remove from your interest profile', action: 'remove_from_profile', icon: <NoAccountsIcon /> },
            { label: 'Report', action: 'report', icon: <ReportIcon /> }, // Changed action to 'report'
            { label: 'Share', action: 'share', icon: <ShareIcon /> },
        ],
        history: [
            { label: 'Delete all history', action: 'delete_all', icon: <FaTrash /> },
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
        switch (action) {
            case 'share':
                setIsShareOpen(!isShareOpen);
                setIsOpen(false);
                break;
            case 'add_to_playlist':
                setIsPlaylistOpen(!isPlaylistOpen);
                setIsOpen(false);
                break;
            case 'add_to_library':
                handleAddLibrary();
                setIsOpen(false);
                break;
            case 'waiting_list':
                handleAddWaitlist();
                setIsOpen(false);
                break;
            case 'report': // Handle the report action
                navigate('/report'); // Navigate to the report page
                setIsOpen(false);
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
                <div className="absolute left-0 mt-2 w-72 rounded-md z-50 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                    style={dropdownStyle({ currentTarget: dropdownRef.current })}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {menuOptions[type].map((option, index) => (
                            <div key={index}>
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
