import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getAlbums } from "../../../../../services/album";

const AlbumRandom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRandomAlbums = async () => {
            try {
                const response = await getAlbums(1, 7);
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

                const filteredAlbums = albumData
                    .filter(album => album.id !== parseInt(id))
                    .slice(0, 6);

                setAlbums(filteredAlbums);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching albums:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };
        fetchRandomAlbums();
    }, [id]);

    console.log("Albums state:", albums);

    const handleAlbumClick = (e, albumId) => {
        e.preventDefault();
        navigate(`/album/${albumId}`);
        window.location.reload();
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!albums || albums.length === 0) return <p>No albums found</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-white font-bold mb-4">You may also like</h2>
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {albums.map((album) => (
                    <div
                        key={album.id}
                        className="relative flex flex-col items-start group"
                        onClick={(e) => handleAlbumClick(e, album.id)}
                    >
                        <div className="cursor-pointer">
                            <img
                                src={album.image}
                                alt={album.title}
                                className="w-[170px] h-[170px] object-cover rounded-md transition-opacity duration-300 group-hover:opacity-50"
                            />
                            <div className="mt-2 text-left">
                                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">
                                    {album.title}
                                </p>
                                <p className="text-gray-400">
                                    {album.artistName}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumRandom;
