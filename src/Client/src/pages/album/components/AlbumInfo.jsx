import React, { useState } from "react";
import "../../../assets/css/artist/artist.css";
import data from "../../../data/fetchSongData";
import { useParams } from "react-router-dom";  

const AlbumInfo = () => {
    const { id } = useParams();
    const albums= data.albums.find(album => album.id === parseInt(id));

    return (
        <div className="relative w-full h-2/4 flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    <div className="w-52 h-52 bg-gray-300 rounded-lg overflow-hidden">
                        <img
                            src={albums.image}
                            alt="Artist Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white ml-6">
                        <div className="flex items-center space-x-2">
                            <h6 className="text-5xl font-bold">{albums.name}</h6>
                        </div>
                        <div className="flex pt-6">
                            <img
                                src={albums.image}
                                alt="Artist Avatar"
                                className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-4"
                            />
                            <p className="text-left text-lg mt-2 pr-6">{albums.title}</p>
                            <p className="text-left text-lg mt-2 text-gray-400">{albums.date}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumInfo;