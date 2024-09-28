import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdMoreHoriz } from 'react-icons/md';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import ShareIcon from '@mui/icons-material/Share';
import { FaMicrophoneAlt } from 'react-icons/fa';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ShareOptions from '../share';
import { handleAddPlaylist } from "../../notification";

const MoreButton = ({ onOptionSelect, songImage, songTitle, artistName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const dropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);

    const menuOptions = {
        songPlay: [
            { label: 'Play similar content', action: 'play_similar', icon: <WifiTetheringIcon  /> },
            { label: 'Add to playlist', action: 'add_to_playlist', icon: <PlaylistAddIcon /> },
            { label: 'Share', action: 'share', icon: <ShareIcon /> },
        ],
    };

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
            default:
                console.log("Action not handled:", action);
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <MdMoreHoriz
                className="text-white cursor-pointer hover:text-gray-500"
                size={24}
                onClick={toggleDropdown}
            />
            {isOpen && (
                <div className="absolute left-0 bottom-full mb-8 w-72 rounded-md z-50 shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="pt-4 flex flex-col items-center">
                        <div className="flex flex-col mb-4">
                            <div className="flex items-center justify-start">
                                <img src={songImage} alt="Song Cover" className="w-12 h-12 rounded mr-2" />
                                <div className="text-white">
                                    <div className="font-bold whitespace-nowrap overflow-hidden text-ellipsis w-[200px]">{songTitle}</div>
                                    <div className="text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-[200px]">{artistName}</div>
                                </div>
                            </div>
                            <div className="rounded-md p-1 flex justify-between items-center w-[250px] bg-gray-700 mt-4">
                                <Link to={'/lyrics/1'}>
                                    <button
                                        className="flex flex-col ml-8 items-center text-gray-300 hover:bg-gray-600 p-2 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <FaMicrophoneAlt className="mb-1" style={{ fontSize: 18 }} />
                                        <span className='text-[13px]'>Lyrics</span>
                                    </button>
                                </Link>
                                <button
                                    className="flex flex-col mr-8 items-center text-gray-300 hover:bg-gray-600 p-2 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <DoNotDisturbIcon className="mb-1" style={{ fontSize: 18 }} />
                                    <span className='text-[13px]'>Block</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {menuOptions.songPlay.map((option, index) => (
                            <div key={index}>
                                <button
                                    className="flex items-center w-full text-left px-4 py-2 text-sm rounded-sm text-gray-300 hover:bg-gray-700 hover:text-white"
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

export default MoreButton;
