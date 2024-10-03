import React, { forwardRef } from 'react';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddIcon from '@mui/icons-material/Add';
import data from '../../../data/fetchSongData';
import { handleAddPlaylist } from "../../notification";
import { useNavigate } from 'react-router-dom';

const AddPlaylistOption = forwardRef(({ onOptionClick }, ref) => {
    const YourPlaylist = data.playlists.filter((playlist) => playlist.role === 1);

    const AddPlaylistOption = YourPlaylist.map((playlist) => ({
        label: playlist.name,
        action: 'add_to_playlist',
        icon: <PlaylistAddIcon />,
    }));

    const navigate = useNavigate();
    const addToPlaylist = { label: 'New playlist', action: 'new_playlist', icon: <AddIcon /> };
    const renderPlaylist = [addToPlaylist, ...AddPlaylistOption];

    const handleNotification = (action) => {
        switch (action) {        
            case 'add_to_playlist':
                handleAddPlaylist();
                break; 
             case 'new_playlist':
                navigate('/playlist/add'); 
                break;             
            default:
                console.log("Action not handled:", action);
        }
    };


    return (
        <div
            ref={ref}
            className="absolute z-50 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 "
            style={{ left: '-210px', top: '0' }}
        >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="playlist-options-menu">
                {renderPlaylist.map((option, index) => (
                    <div key={index}>
                        <button
                            className="flex items-center w-full text-left px-4 py-2 text-sm rounded-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            role="menuitem"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOptionClick(option.action);
                                handleNotification(option.action);
                            }}
                        >
                            <span className="mr-3 flex items-center">{option.icon}</span>
                            <div className='text-white whitespace-nowrap overflow-hidden text-ellipsis w-[150px]'>
                                {option.label}
                            </div>
                        </button>
                        {/* Thêm thẻ ngang dưới cả icon và label */}
                        {option.label === 'New playlist' && (
                            <hr className="border-gray-600 my-1" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default AddPlaylistOption;
