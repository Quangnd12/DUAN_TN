import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getArtists } from "../../../../../services/artist";
import { slugify } from "../../../components/createSlug";

const RelatedArtist = () => {
    const { id: artistSlug } = useParams();
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRelatedArtists = async () => {
            try {
                const response = await getArtists(1, 15);

                if (response && response.artists) {
                    const currentArtistId = parseInt(window.location.pathname.split('/artist/')[1]);

                    const availableArtists = response.artists
                        .filter(artist => artist.id !== currentArtistId);

                    const shuffledArtists = availableArtists
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 6);

                    setArtists(shuffledArtists);
                } else {
                    setError("Không tìm thấy dữ liệu nghệ sĩ");
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu nghệ sĩ:", err);
                setError("Đã xảy ra lỗi khi tải dữ liệu");
                setIsLoading(false);
            }
        };
        fetchRelatedArtists();
    }, [artistSlug]);

    const handleArtistClick = (e, artistName) => {
        e.preventDefault();
        const newSlug = slugify(artistName);
        navigate(`/artist/${newSlug}`);
        window.location.reload();
    };

    if (isLoading) return <div className="text-white">Đang tải...</div>;
    if (error) return <div className="text-white">{error}</div>;
    if (!artists || artists.length === 0) return <div className="text-white">Không tìm thấy nghệ sĩ liên quan</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-white font-bold mb-4">Nghệ sĩ bạn có thể thích</h2>
            </div>

            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        onClick={(e) => handleArtistClick(e, artist.name)}
                        className="cursor-pointer"
                    >
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <img
                                    src={artist.avatar}
                                    alt={artist.name}
                                    className="w-[170px] h-[170px] object-cover rounded-full transition-opacity duration-300 group-hover:opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                                        Xem chi tiết
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-white font-semibold hover:underline">
                                    {artist.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {artist.description || 'Nghệ sĩ'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedArtist;
