import React, { useState, useEffect } from "react";
import "../../../assets/css/artist/artist.css";
import { useParams } from "react-router-dom";
import { getGenres } from '../../../../../services/genres';
import { translations } from "../../../utils/translations/translations";
import { useTheme } from "../../../utils/ThemeContext";

const TopRankInfo = () => {
    const { id } = useParams();
    const { language } = useTheme();
    const [genreData, setGenreData] = useState(null);

    useEffect(() => {
        const fetchGenreData = async () => {
            try {
                const data = await getGenres();
                const foundGenre = data.genres.find(genre => genre.id === parseInt(id));
                setGenreData(foundGenre);
            } catch (error) {
                console.error("Error fetching genre data:", error);
            }
        };

        fetchGenreData();
    }, [id]);

    if (!genreData) {
        return <div className="text-gray-600">{translations[language].loading}</div>;
    }

    return (
        <div className="relative w-full h-96 bg-black flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"
                        style={{
                            top: `${i * 10}%`,
                            animationDuration: '3s',
                            animationDelay: `${i * 0.3}s`,
                            animationIterationCount: 'infinite',
                            animationName: 'waveEffect',
                            animationTimingFunction: 'ease-in-out',
                        }}
                    ></div>
                ))}
            </div>
            <style jsx>{`
                @keyframes waveEffect {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
            `}</style>
            <div className="relative z-10 text-white text-center p-4 max-w-5xl">
                <h1 className="text-6xl font-black mb-4 tracking-tighter">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">TOP</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"> 100</span>
                </h1>
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
                    {`${genreData.name.toUpperCase()} TRACKS`}
                </h2>
                <p className="text-lg text-gray-400 mb-6 max-w-3xl mx-auto">
                    {genreData.description || `${translations[language].Songs} ${genreData.name} ${translations[language].bestToday}`}
                </p>
                <div className="flex justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full animate-pulse"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default TopRankInfo;
