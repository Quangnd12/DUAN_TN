import React, { useState, useContext } from 'react';
import { MdPlayArrow } from 'react-icons/md';
import { PlayerContext } from 'Client/src/components/context/MusicPlayer';
import { handleWarning } from '../../../components/notification';
import useAge from 'Client/src/components/calculateAge';

const SongsResults = ({ songs }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const age = useAge();

  if (!songs || songs.length === 0) {
    return (
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">Songs</h2>
        <div className="flex items-center justify-center h-40 bg-zinc-800/30 rounded-lg">
          <p className="text-gray-400">No songs found</p>
        </div>
      </div>
    );
  }

  const handleRowClick = (song, index) => {
    if (song.is_explicit === 1 && age < 18) {
      handleWarning();
      setClickedIndex(null);
      return;
    }
    
    setPlayerState({
      audioUrl: song.file_song,
      title: song.title,
      artist: song.artists?.join(', ') || '',
      Image: song.image,
      lyrics: song.lyrics || 'Lyrics not available',
      album: song.albums?.[0] || '',
      playCount: song.listens_count || 0,
      TotalDuration: song.duration,
      songId: song.id,
      is_premium: song.is_premium || 0,
      albumTitle: song.albums?.[0] || '',
      artistName: song.artists?.join(', ') || '',
    });
    setClickedIndex(index);

    try {
      localStorage.setItem("songs", JSON.stringify(songs));
    } catch (error) {
      console.error("Error saving songs to localStorage:", error);
    }
  };

  return (
    <div className="pt-4 w-full text-white">
      <h2 className="text-xl font-bold mb-4">Songs</h2>
      <div className="flex flex-col gap-2">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg transition-all cursor-pointer
              ${hoveredIndex === index || clickedIndex === index 
                ? "bg-gray-700/50" 
                : "hover:bg-gray-800/30"}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleRowClick(song, index)}
          >
            <div className="w-8 flex justify-center">
              {hoveredIndex === index || clickedIndex === index ? (
                <MdPlayArrow className="text-white" size={22} />
              ) : (
                <span className="text-gray-400 text-sm">{index + 1}</span>
              )}
            </div>

            <img 
              src={song.image} 
              alt={song.title} 
              className="w-12 h-12 object-cover rounded-md mx-4" 
            />
            
            <div className="flex-grow flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium text-sm truncate
                  ${clickedIndex === index ? 'text-blue-400' : 'text-white'}`}>
                  {song.title}
                </h4>
                {song.is_premium === 1 && (
                  <span className="bg-yellow-500/90 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    PREMIUM
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-400 text-xs mt-0.5">
                <p className="truncate">{song.artists?.join(', ')}</p>
                {song.albums?.length > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <p className="truncate">{song.albums[0]}</p>
                  </>
                )}
              </div>
            </div>

            <span className="text-gray-400 text-sm ml-4">
              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsResults;