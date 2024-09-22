import React, { useState } from "react";
import "../../../assets/css/artist/artist.css";
import data from "../../../data/fetchSongData";
import { useParams } from "react-router-dom";

const PlayListInfo = () => {
    const { id } = useParams();
    const playlist = data.playlists.find(playlist => playlist.id === parseInt(id));
    const countSongs = () => {
        return data.playlists.length;
    };

    return (
        <div className="relative w-full h-2/4 flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    <div className="w-52 h-52 bg-gray-300 rounded-lg overflow-hidden">
                        <img
                            src={playlist.image}
                            alt="Artist Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white ml-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <h6 className="text-sm font-bold">Playlist</h6>
                        </div>
                        <div className="flex items-center space-x-2">
                            <h6 className="text-5xl font-bold overflow-hidden text-ellipsis w-[700px] line-clamp-2">{playlist.name}</h6>
                        </div>
                        <div className="flex items-center pt-2">
                            <img
                                src={playlist.image}
                                alt="Artist Avatar"
                                className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-4"
                            />
                            <p className="text-left text-lg mt-2 pr-4 ">{playlist.title}</p>
                            <div className="flex items-center">
                                <p style={{ fontSize: '40px', color: 'white', marginBottom: '20px', marginRight: '5px' }}>.</p>
                                <p className="text-left text-lg mt-2 text-gray-400">{countSongs()} songs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayListInfo;
