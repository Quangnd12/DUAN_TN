import {slugify} from "Client/src/components/createSlug";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "../../../../data/fetchSongData";

const ShowAllListArtists = () => {

    return (
        <div className="text-white bg-zinc-900 p-6 rounded-md w-full overflow-hidden">
        <div className="flex flex-col mx-auto">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold">Popular Artist</h2>
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {data.artists.map((artist) => (
                    <Link to={`/artist/${slugify(artist.name)}`} key={artist.id}>
                        <div className="flex flex-col items-start mb-6">
                            <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-[170px] h-[170px] object-cover rounded-full"
                            />
                            <div className="mt-2 text-center">
                                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{artist.name}</p>
                                <p className="text-gray-400">{artist.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
    );
};

export default ShowAllListArtists;
