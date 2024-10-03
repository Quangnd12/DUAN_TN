import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import data from "../../../data/fetchSongData";
import { BiPlusCircle } from "react-icons/bi";
import { createAlbumSlug } from "Client/src/components/createSlug";

const PlaylistFavorite = () => {
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

    const addPlaylist = () => {
        const newPlaylistNumber = playlists.length + 1;
        const newPlaylist = {
            id: newPlaylistNumber,
            name: `Danh sách phát #${newPlaylistNumber}`,
        };

        setPlaylists([...playlists, newPlaylist]);
        navigate('/playlist/add', { state: { playlistName: `Danh sách phát #${newPlaylistNumber}` } });
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl text-white font-bold">Your favorite playlist</h2>
                    <BiPlusCircle className="ml-4 text-3xl text-white cursor-pointer" onClick={addPlaylist} />
                </div>
                <Link to={"/playlist/all"} className="ml-2 text-blue-400 hover:underline">
                    Show All
                </Link>
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {data.playlists.slice(0, 6).map((playlist, index) => (
                    <Link to={`/playlist/${createAlbumSlug(playlist.name, playlist.title)}`} key={playlist.id}>
                        <div
                            className="flex flex-col items-start"
                        >
                            <img
                                src={playlist.image}
                                alt={playlist.name}
                                className="w-[170px] h-[170px] object-cover rounded-md"
                            />
                            <div className="mt-2 text-left">
                                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{playlist.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PlaylistFavorite;
