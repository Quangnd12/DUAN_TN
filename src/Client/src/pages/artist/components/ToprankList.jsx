import React from "react";
import { Link } from "react-router-dom";
import data from "../../../data/fetchtopData"; // Ensure your path is correct

const AllTopranks = () => {
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


            {data.topranks.length > 0 ? (
                data.topranks.map((toprank) => (
                    <div key={toprank.id} className="mb-8">
                        <div className="relative z-10 text-white p-4 mb-8">
                            <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-30 animate-pulse"></div>
                            <h2 className="relative text-2xl font-semibold mb-4 tracking-tight z-20">
                                {toprank.Title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {toprank.gender.map((genre) => (
                                <Link
                                    to={`/toprank/${genre.id}`}
                                    key={genre.id}
                                    className="flex flex-col items-start mb-6 rounded-lg p-4 shadow-lg"
                                >
                                    <figure className="relative mt-2">
                                        <img
                                            src={genre.image}
                                            className="w-52 h-52 object-cover rounded-lg mb-4"
                                            alt={`${genre.title} cover`}
                                        />
                                        <figcaption className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white text-center p-2">
                                            {genre.title}
                                        </figcaption>
                                    </figure>
                                    <h2 className="text-lg font-bold text-white">{genre.title}</h2>
                                    <p className="text-xs text-gray-300">
                                        Nghệ sĩ nổi bật: {genre.popularArtists.length > 3 ? `${genre.popularArtists.slice(0, 3).join(", ")}...` : genre.popularArtists.join(", ")}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400">Không có dữ liệu để hiển thị.</p>
            )}
        </div>
    );
};

export default AllTopranks;
