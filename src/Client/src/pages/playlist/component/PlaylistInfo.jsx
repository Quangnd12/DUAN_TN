import React, { useState } from "react";
import "../../../assets/css/artist/artist.css";
import data from "../../artist/utils/fetchSongData";
import { useParams } from "react-router-dom";  

const PlayListInfo = () => {
    const {id}  = useParams();
    const playlist= data.playlists.find(playlist => playlist.id === parseInt(id));

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
                        <div className="flex items-center space-x-2">
                            <h6 className="text-5xl font-bold">{playlist.name}</h6>
                        </div>
                        <div className="flex pt-6">
                            <img
                                src={playlist.image}
                                alt="Artist Avatar"
                                className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-4"
                            />
                            <p className="text-left text-lg mt-2 pr-6">{playlist.title}</p>
                            <p className="text-left text-lg mt-2 text-gray-400">{"7 songs"}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayListInfo;
