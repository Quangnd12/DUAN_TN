import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../../../data/fetchSongData";

const Artist = () => {

    useEffect(() => {

    }, []);


    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-white font-bold mb-4">You May Like</h2>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {data.artists.slice(0, 5).map((artist, index) => (
                    <Link to={`/artist/${artist.id}`} key={artist.id}>
                        <div
                            className="flex flex-col items-center"
                        >
                            <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-52 h-52 object-cover rounded-full"
                            />
                            <div className="mt-2 text-center">
                                <p className="text-white font-semibold">{artist.name}</p>
                                <p className="text-gray-400">{artist.category}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Artist;
