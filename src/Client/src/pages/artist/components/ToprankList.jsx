import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres } from '../../../../../services/genres';
import { getSongs } from '../../../../../services/songs';

const AllTopranks = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            const data = await getGenres();
            const genresWithPopularSongs = [];

            for (const genre of data.genres || []) {
                const songsData = await getSongs(0, 100, '', [genre.id]);
                const hasPopularSongs = (songsData.songs || []).some(song => song.listens_count >= 100000);

                if (hasPopularSongs) {
                    genresWithPopularSongs.push(genre);
                }
            }

            setGenres(genresWithPopularSongs);
        };
        fetchGenres();
    }, []);

    return (
        <div className="p-6 mt-4 text-white">
            {/* Banner Section */}
            <div className="relative mb-6 p-8 rounded-lg shadow-lg flex items-center justify-center bg-gradient-to-r from-zinc-900 to-blue-600 overflow-hidden">
                <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="absolute bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            filter: 'blur(40px)',
                            animation: `pulse ${Math.random() * 10 + 5}s infinite alternate`
                        }}></div>
                    ))}
                </div>
                <h1 className="relative text-5xl font-bold text-white text-center drop-shadow-lg z-10">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">TOP 100</span>
                </h1>
            </div>

            {genres.length > 0 ? (
                <div className="mb-8">
                    <div className="relative z-10 text-white p-4 mb-8">
                        <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-30 animate-pulse"></div>
                        <h2 className="relative text-2xl font-semibold mb-4 tracking-tight z-20">
                            Top Thể Loại
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {genres.map((genre) => (
                            <Link
                                to={`/toprank/${genre.id}`}
                                key={genre.id}
                                className="flex flex-col items-start mb-6 rounded-lg p-4 shadow-lg hover:bg-gray-800 transition duration-300"
                            >
                                <figure className="relative mt-2">
                                    <img
                                        src={genre.image}
                                        className="w-52 h-52 object-cover rounded-lg mb-4"
                                        alt={`${genre.name} cover`}
                                    />
                                    <figcaption className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white text-center p-2">
                                        {genre.name}
                                    </figcaption>
                                </figure>
                                <h2 className="text-lg font-bold text-white">{genre.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 text-xs font-semibold bg-purple-600 rounded-full text-white">
                                        {genre.country || 'Quốc tế'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400">Không có dữ liệu để hiển thị.</p>
            )}
        </div>
    );
};

export default AllTopranks;
