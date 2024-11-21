import React, { useState, useEffect,useRef } from "react";
import { MdClose } from 'react-icons/md';
import MoreButton from "Client/src/components/button/more";
import "../../assets/css/lyric.css";

const Lyrics = ({ onClose, lyrics, title, artist, album, image, playCount, currentTime,TotalDuration }) => {
    const lyricsContainerRef = useRef(null); 
    const lyricsArray = lyrics.split('\n').map((lyric, index) => ({
        text: lyric,
        time: (index * TotalDuration) / lyrics.split('\n').length, 
    }));

    const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

console.log(currentTime);
    useEffect(() => {
        const index = lyricsArray.findIndex((lyric, idx) => {
            return currentTime >= lyric.time && currentTime < (lyricsArray[idx + 1]?.time || Number.MAX_SAFE_INTEGER);
        });

        if (index !== -1) {
            setCurrentLyricIndex(index);  // Cập nhật index của lyric hiện tại
        }
    }, [currentTime, lyricsArray]);

    // Hàm cuộn lyrics đến dòng hiện tại
    useEffect(() => {
        if (lyricsContainerRef.current) {
            const currentLyricElement = lyricsContainerRef.current.children[currentLyricIndex];
            if (currentLyricElement) {
                currentLyricElement.scrollIntoView({
                    behavior: "smooth", // Cuộn mượt mà
                    block: "center", // Đưa dòng hiện tại vào giữa container
                });
            }
        }
    }, [currentLyricIndex]);

    // Hàm xử lý chọn các tùy chọn
    const handleOptionSelect = (action) => {
        console.log('Selected action:', action);
    };

    return (
        <div className="bg-zinc-900 text-white p-4 shadow-lg max-w-full h-[900px] relative">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
                onClick={onClose}
            >
                <MdClose className="h-7 w-7 transition-transform duration-300 hover:scale-110" />
            </button>

            <div className="flex items-center mb-4 pl-52 mt-5">
                <h1 className="text-4xl font-bold mr-10">{title}</h1>
                <span className="bg-zinc-900 border-2 border-blue-500 text-blue-500 text-xs font-bold px-2 py-1 rounded mt-2">MUSIC HEALS</span>
            </div>

            <div className="flex text-sm mb-6 space-x-10 pl-52">
                <p>Artist: <span className="font-bold">{artist}</span></p>
                <p>Album: <span className="font-bold">{album}</span></p>
            </div>

            <div className="flex mb-4 pl-52">
                <img src={image} alt="Album cover" className="w-96 h-96 rounded-lg mr-4" />
                <div className="text-lg flex flex-col justify-center space-y-7 pl-40">
                <p className="text-gray-300 lyrics-container" ref={lyricsContainerRef}>
                        {lyricsArray.map((lyric, index) => (
                            <div
                                key={index}
                                className={`lyric ${index === currentLyricIndex ? "active" : "inactive"}`}
                            >
                                {lyric.text}
                            </div>
                        ))}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center pl-52">
                <div className="flex space-x-4 items-center">
                    <MoreButton
                        type="lyrics"
                        onOptionSelect={handleOptionSelect}
                    />
                </div>
            </div>

            <br />
            <div className="flex flex-col pl-52 mb-4">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold mt-10">Plays</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">{playCount}</div>

                </div>
            </div>
        </div>
    );
};

export default Lyrics;
