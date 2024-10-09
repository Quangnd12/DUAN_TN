import { createAlbumSlug } from "../../../../components/createSlug";
import React from "react";
import { Link } from "react-router-dom";
import data from "../../../../data/fetchSongData";

const ShowAllListAlbums = () => {
    return (
        <div className="text-white bg-zinc-900 p-6 rounded-md w-full overflow-hidden">
            <div className="flex flex-col mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold">Popular Albums</h2>
                </div>
                <div className="grid grid-cols-6 gap-4 justify-items-center">
                    {data.albums.map((album) => (
                        <Link to={`/album/${createAlbumSlug(album.name, album.title)}`} key={album.id}>
                            <div className="flex flex-col items-start mb-6">
                                <img
                                    src={album.image}
                                    alt={album.name}
                                    className="w-[170px] h-[170px] object-cover rounded-md"
                                />
                                <div className="mt-2 text-left">
                                    <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{album.name}</p>
                                    <p className="text-gray-400">{album.date}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowAllListAlbums;
