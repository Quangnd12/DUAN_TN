import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "../../../data/fetchSongData";

const AllAlbums = () => {

    return (
        <div className="p-6 mt-4 text-white">
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold">Adele - All albums</h2>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-4 ">
                    {data.albums.map((album, index) => (
                        <>
                            <Link to={`/listalbum/${album.id}`}>
                                <div
                                    key={index}
                                    className="flex flex-col items-start mb-6"
                                >
                                    <img
                                        src={album.image}
                                        alt={album.name}
                                        className="w-52 h-52 object-cover rounded-lg"
                                    />
                                    <div className="mt-2 text-left">
                                        <p className="text-white font-semibold">{album.name}</p>
                                        <p className="text-gray-400">{album.date}</p>
                                    </div>
                                </div>
                            </Link>
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllAlbums;
