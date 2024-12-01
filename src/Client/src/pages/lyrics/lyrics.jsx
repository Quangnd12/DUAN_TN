import React, { useState, useEffect, useRef } from "react";
import { MdClose } from 'react-icons/md';
import MoreButton from "Client/src/components/button/more";
import "../../assets/css/lyric.css";

const Lyrics = ({ onClose, lyrics, title, artist, album, image, playCount, currentTime, TotalDuration, isPlaying }) => {
    const lyricsContainerRef = useRef(null);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState(0);

    // Xử lý lyrics với timestamp
    useEffect(() => {
        if (!lyrics) return;

        try {
            // Kiểm tra nếu lyrics có định dạng [mm:ss.xx]
            const hasTimestamps = /^\[\d{2}:\d{2}\.\d{2}\]/.test(lyrics);

            if (hasTimestamps) {
                // Xử lý lyrics có timestamp
                const processedLines = lyrics
                    .split('\n')
                    .filter(line => line.trim())
                    .map(line => {
                        const timeMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
                        if (timeMatch) {
                            const [_, minutes, seconds, milliseconds] = timeMatch;
                            const startTime = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100;
                            return {
                                text: timeMatch[4].trim(),
                                startTime,
                                endTime: 0 // Sẽ được cập nhật ở bước tiếp theo
                            };
                        }
                        return null;
                    })
                    .filter(line => line !== null);

                // Cập nhật endTime cho mỗi dòng
                for (let i = 0; i < processedLines.length; i++) {
                    processedLines[i].endTime = i < processedLines.length - 1
                        ? processedLines[i + 1].startTime
                        : TotalDuration;
                }

                setLines(processedLines);
            } else {
                // Xử lý lyrics không có timestamp
                const rawLines = lyrics.split('\n').filter(line => line.trim());
                const averageTime = TotalDuration / rawLines.length;

                const processedLines = rawLines.map((line, index) => ({
                    text: line,
                    startTime: index * averageTime,
                    endTime: (index + 1) * averageTime
                }));

                setLines(processedLines);
            }
        } catch (error) {
            console.error("Error processing lyrics:", error);
        }
    }, [lyrics, TotalDuration]);

    // Cập nhật dòng hiện tại và cuộn
    useEffect(() => {
        if (!lines.length || currentTime === undefined) return;

        const newCurrentLine = lines.findIndex(
            line => currentTime >= line.startTime && currentTime < line.endTime
        );

        if (newCurrentLine !== -1 && newCurrentLine !== currentLine) {
            setCurrentLine(newCurrentLine);

            // Cuộn đến dòng hiện tại
            const element = lyricsContainerRef.current?.children[newCurrentLine];
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest"
                });
            }
        }
    }, [currentTime, lines, currentLine]);

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
                <span className="bg-zinc-900 border-2 border-blue-500 text-blue-500 text-xs font-bold px-2 py-1 rounded mt-2">
                    MUSIC HEALS
                </span>
            </div>

            <div className="flex text-sm mb-6 space-x-10 pl-52">
                <p>Artist: <span className="font-bold">{artist}</span></p>
                <p>Album: <span className="font-bold">{album}</span></p>
            </div>

            <div className="flex mb-4 pl-52">
                <img src={image} alt="Album cover" className="w-96 h-96 rounded-lg mr-4" />
                <div className="text-lg flex flex-col justify-center space-y-7 pl-40">
                    <div className="lyrics-container" ref={lyricsContainerRef}>
                        {lines.map((line, index) => (
                            <div
                                key={index}
                                className={`lyric ${index === currentLine
                                        ? "active"
                                        : index < currentLine
                                            ? "past"
                                            : "future"
                                    }`}
                            >
                                {line.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pl-52">
                <div className="flex space-x-4 items-center">
                    <MoreButton type="lyrics" onOptionSelect={() => { }} />
                </div>
            </div>

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
