import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { MdMoreHoriz } from 'react-icons/md';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import ShareIcon from '@mui/icons-material/Share';
import { FaMicrophoneAlt } from 'react-icons/fa';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ShareOptions from '../share';
import AddPlaylistOption from '../../dropdown/dropdownAddPlaylist';
import LyricModal from '../../lyrics';
import { PlayerContext } from "../../context/MusicPlayer";


const MoreButton = ({ onOptionSelect, songImage, songTitle, artistName, lyrics }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const dropdownRef = useRef(null);
    const shareDropdownRef = useRef(null);
    const playlistDropdownRef = useRef(null);
    const { playerState } = useContext(PlayerContext);
    const { is_premium } = playerState;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (is_premium) {
            setIsModalOpen(false);
            navigate('/upgrade');
        } else {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal
    };

    const menuOptions = {
        songPlay: [
            { label: 'Play similar content', action: 'play_similar', icon: <WifiTetheringIcon /> },
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
        switch (action) {
            case 'share':
                setIsShareOpen(!isShareOpen);
                setIsOpen(false);
                break;
            case 'add_to_playlist':

                setIsPlaylistOpen(!isPlaylistOpen);
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

                                <button
                                    className="flex flex-col ml-8 items-center text-gray-300 hover:bg-gray-600 p-2 rounded"
                                    onClick={handleButtonClick}
                                >
                                    <FaMicrophoneAlt className="mb-1" style={{ fontSize: 18 }} />
                                    <span className='text-[13px]'>Lyrics</span>
                                </button>
                                {isModalOpen && (
                                    <LyricModal onClose={closeModal} lyrics={lyrics}>
                                        <div className="p-4">
                                            <h2 className="text-xl">Lyrics Content</h2>
                                            <p>Here are the lyrics...</p>
                                        </div>
                                    </LyricModal>
                                )}
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
                                    className={`flex items-center w-full text-left px-4 py-2 text-sm rounded-sm text-gray-300 hover:bg-gray-700 hover:text-white
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
