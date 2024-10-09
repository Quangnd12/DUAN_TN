import React, { useState } from "react";
import { Link } from "react-router-dom";
import data from "../../../data/fetchSongData";
import AlbumHover from "../../../components/hover";
import PlayerControls from "../../../components/audio/PlayerControls";
import { createAlbumSlug } from "../../../components/createSlug";

const AlbumRandom = () => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredAlbum, setHoveredAlbum] = useState(null);
    const [clickedAlbum, setClickedAlbum] = useState(null);

    const playAudio = (album) => {
        return album.audioUrl; // Giả sử mỗi album có thuộc tính audioUrl
    };

    const handlePlayClick = (album) => {
        if (selectedPlayer && selectedPlayer.id === album.id) {
            // Nếu album đang phát, chuyển sang trạng thái tạm dừng
            setIsPlaying((prev) => !prev);
        } else {
            // Nếu album khác đang phát, chuyển album và bắt đầu phát
            setSelectedPlayer(album);
            setIsPlaying(true);
            const audioUrl = playAudio(album); // Lấy đường dẫn âm thanh
            setSelectedPlayer({ ...album, audioUrl }); // Cập nhật selectedPlayer với audioUrl
        }
        setClickedAlbum(album.id); // Ghi nhớ album đã click
    };

    const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-white font-bold mb-4">You may also like</h2>
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {data.albums.slice(0, 6).map((album) => (
                    <div
                        key={album.id}
                        className="relative flex flex-col items-start group"
                        onMouseEnter={() => setHoveredAlbum(album.id)}
                        onMouseLeave={() => {
                            if (clickedAlbum !== album.id) {
                                setHoveredAlbum(null);
                            }
                        }}
                    >
                        <Link to={`/album/${createAlbumSlug(album.name, album.title)}`} key={album.id}>
                            <img
                                src={album.image}
                                alt={album.name}
                                className={`w-[170px] h-[170px] object-cover rounded-md transition-opacity duration-300 group-hover:opacity-50 ${clickedAlbum === album.id ? 'opacity-50' : ''}`}
                            />
                        </Link>
                        <AlbumHover
                            album={album}
                            onPlayClick={() => handlePlayClick(album)}
                            isPlaying={selectedPlayer && selectedPlayer.id === album.id && isPlaying}
                            show={hoveredAlbum === album.id}
                            isClicked={clickedAlbum === album.id}
                            selectedPlayer={selectedPlayer} // Truyền selectedPlayer vào
                            globalIsPlaying={isPlaying} // Truyền trạng thái isPlaying
                        />
                        <div className="mt-2 text-left">
                            <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{album.name}</p>
                            <p className="text-gray-400">{album.date}</p>
                        </div>
                    </div>
                ))}
            </div>
            {selectedPlayer && (
                <PlayerControls
                    audioUrl={audioUrl} // Truyền audioUrl vào đây
                    title={selectedPlayer.name}
                    artist={selectedPlayer.title}
                    Image={selectedPlayer.image}
                    next={() => {/* Logic cho bài tiếp theo */ }}
                    prev={() => {/* Logic cho bài trước */ }}
                    onTrackEnd={() => {/* Xử lý khi track kết thúc */ }}
                    isPlaying={isPlaying} // Trạng thái phát nhạc
                />
            )}
        </div>
    );
};

export default AlbumRandom;
