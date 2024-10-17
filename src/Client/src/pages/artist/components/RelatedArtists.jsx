import { slugify } from "../../../components/createSlug";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "../../../data/fetchSongData";

const RelatedArtist = () => {

    useEffect(() => {
        // Any effect code if needed
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-white font-bold mb-4">You May Like</h2>
            </div>

            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {data.artists.slice(0, 6).map((artist, index) => (
                    <Link to={`/artist/${slugify(artist.name)}`} key={artist.id}>
                        <div
                            className="flex flex-col items-center"
                        >
                            <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-[170px] h-[170px] object-cover rounded-full"
                            />
                            <div className="mt-2 text-center">
                                <p className="text-white font-semibold">{artist.name}</p>
                                <p className="text-gray-400">{artist.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedArtist;
