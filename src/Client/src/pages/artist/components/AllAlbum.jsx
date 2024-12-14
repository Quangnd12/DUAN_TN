import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlbums } from "../../../../../services/album";

const AllAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllAlbums = async () => {
            try {
                const response = await getAlbums(1, 12); // Lấy 12 album
                let albumData = [];

                if (response && response.data && response.data.albums) {
                    albumData = response.data.albums;
                } else if (response && response.data) {
                    albumData = response.data;
                } else if (response && Array.isArray(response)) {
                    albumData = response;
                } else if (response && response.albums) {
                    albumData = response.albums;
                }
                
                setAlbums(albumData);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching albums:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };
        fetchAllAlbums();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!albums || albums.length === 0) return <p>No albums found</p>;

    return (
        <div className="text-white bg-zinc-900 p-6 rounded-md w-full overflow-hidden">
            <div className="flex flex-col mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold">All Albums</h2>
                </div>
                <div className="grid grid-cols-6 gap-4 justify-items-center">
                    {albums.map((album) => (
                        <Link to={`/album/${album.id}`} key={album.id}>
                            <div className="flex flex-col items-start mb-6">
                                <img
                                    src={album.image}
                                    alt={album.title}
                                    className="w-[170px] h-[170px] object-cover rounded-lg"
                                />
                                <div className="mt-2 text-left">
                                    <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">
                                        {album.title}
                                    </p>
                                    <p className="text-gray-400">{album.artistName}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllAlbums;
