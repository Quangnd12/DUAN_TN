import React, { useEffect, useState } from "react";
import { getSongs } from "services/songs";
import { translations } from "../../../utils/translations/translations";
import { useTheme } from "../../../utils/ThemeContext";


const GenreInfo = ({ id }) => {
  const { language } = useTheme();
  const [Songs, setSongs] = useState([]);

  const SongData = async (page = 0, limit = 0, search = '', genre = [], minDuration = 0, maxDuration = 0, minListensCount = 0, maxListensCount = 0) => {
    const data = await getSongs(page, limit, search, genre, minDuration, maxDuration, minListensCount, maxListensCount);
    setSongs(data.songs || []);
  };

  useEffect(() => {
    if (id) {
      const genre = JSON.parse(id)
      SongData(0, 0, '', [genre]);
    }
  }, [id]);

  return (
    <div className="relative w-full h-1/3 flex bg-gradient-to-b from-[#121212] via-[#181818] to-[#1a1a1a] transition-all duration-300 hover:from-[#1a1a1a] hover:to-[#121212]">
      {Songs.slice(0, 1).map((song) => (
        <div
          className="w-full h-full artist-bg flex flex-col justify-center p-12 relative overflow-hidden"
          key={song.id}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-0"></div>

          <div className="max-w-7xl mx-auto w-full relative z-10 animate-fadeIn">
            <span className="text-gray-300 text-lg mb-4 block hover:text-white transition-colors duration-300">
              {translations[language].genres}
            </span>
            <h1 className="text-8xl font-bold text-white mb-6 tracking-tight hover:scale-[1.01] transform transition-transform duration-300">
              {song.genre}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors duration-300">
              <p className="text-lg hover:text-white transition-colors">
                {Songs.length} {translations[language].songs}
              </p>
              <div className="w-1px h-4 bg-gray-600"></div>
              <p className="text-lg hover:text-white transition-colors">
                {translations[language].totalDuration}: {Math.floor(Songs.reduce((acc, song) => acc + song.duration, 0) / 60)} {translations[language].minutes}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenreInfo;
