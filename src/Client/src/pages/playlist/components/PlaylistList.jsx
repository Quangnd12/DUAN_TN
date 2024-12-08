import React, { useState, useRef, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { 
    MdPlayArrow, 
    MdShuffle, 
    MdCheckBoxOutlineBlank, 
    MdCheck,
    MdDelete 
} from "react-icons/md";
import { 
    useGetPlaylistByIdQuery,
    useRemoveSongFromPlaylistMutation 
} from "../../../../../redux/slice/playlistSlice";
import { PlayerContext } from "Client/src/components/context/MusicPlayer";
import SongItem from "../../../components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";
import useAge from "Client/src/components/calculateAge";
import { formatDuration } from "Admin/src/components/formatDate";
import { handleWarning } from "../../../components/notification";
import { toast } from "react-toastify";
import LikeButton from "../../../components/button/favorite";

const ListSongOfPlaylist = () => {
    const location = useLocation();
    const { id: routePlaylistId } = useParams();

    const playlistId = location.state?.playlistId || routePlaylistId;

    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [likedSongs, setLikedSongs] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    const { data, isLoading: isQueryLoading, error: queryError, refetch } = useGetPlaylistByIdQuery(playlistId, {
        skip: !playlistId,
        pollingInterval: 1000
    });

    const [removeSongFromPlaylist, { isLoading: isRemoving }] = useRemoveSongFromPlaylistMutation();

    const dropdownRefs = useRef({});
    const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
    const age = useAge();

    useEffect(() => {
        if (data) {
            setPlaylist(data);
            setIsLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (queryError) {
            setError(queryError.message);
            setIsLoading(false);
        }
    }, [queryError]);

    // Hàm xử lý xóa bài hát
    const handleDeleteSongs = async () => {
        try {
            if (selectedCheckboxes.size > 0) {
                const deletePromises = Array.from(selectedCheckboxes).map(index => 
                    removeSongFromPlaylist({
                        playlistId: playlistId, 
                        songId: playlist.songs[index].id
                    }).unwrap()
                );

                await Promise.all(deletePromises);
                
                await refetch();
                
                toast.success(`Đã xóa ${selectedCheckboxes.size} bài hát khỏi playlist`);
                setSelectedCheckboxes(new Set());
                setIsSelectAllChecked(false);
            }
        } catch (error) {
            console.error("Lỗi khi xóa bài hát:", error);
            toast.error("Không thể xóa bài hát khỏi playlist");
        }
    };

    // Thêm useEffect để lắng nghe sự kiện cập nhật playlist
    useEffect(() => {
        const handlePlaylistUpdate = async () => {
            await refetch();
        };

        // Lắng nghe sự kiện từ các component khác
        window.addEventListener('playlist-updated', handlePlaylistUpdate);

        return () => {
            window.removeEventListener('playlist-updated', handlePlaylistUpdate);
        };
    }, [refetch]);

    const handleRowClick = (song, index) => {
        if (song.is_explicit === 1 && age < 18) {
            handleWarning();
            setClickedIndex(null);
            return;
        } else {
            setPlayerState({
                audioUrl: song.file_song,
                title: song.title,
                artistNames: song.artistNames,
                Image: song.image,
                lyrics: song.lyrics,
                playCount: song.listens_count,
                TotalDuration: song.duration
            });
            setClickedIndex(index);
        }
    };

    const handleCheckboxToggle = (index) => {
        setSelectedCheckboxes(prevSelectedCheckboxes => {
            const updatedCheckboxes = new Set(prevSelectedCheckboxes);
            if (updatedCheckboxes.has(index)) {
                updatedCheckboxes.delete(index);
            } else {
                updatedCheckboxes.add(index);
            }

            if (updatedCheckboxes.size === playlist.songs.length) {
                setIsSelectAllChecked(true);
            } else if (updatedCheckboxes.size === 0) {
                setIsSelectAllChecked(false);
            } else {
                setIsSelectAllChecked(false);
            }

            return updatedCheckboxes;
        });
    };

    const handleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedCheckboxes(new Set());
        } else {
            const allIndices = playlist.songs.map((_, idx) => idx);
            setSelectedCheckboxes(new Set(allIndices));
        }
        setIsSelectAllChecked(!isSelectAllChecked);
    };

    const handleLikeToggle = (index) => {
        setLikedSongs((prevLikedSongs) => ({
            ...prevLikedSongs,
            [index]: !prevLikedSongs[index],
        }));
    };

    const handleDropdownToggle = (index) => {
        setDropdownIndex(index === dropdownIndex ? null : index);
    };

    const isAnyCheckboxSelected = () => {
        return selectedCheckboxes.size > 0;
    };

    if (isLoading || isQueryLoading) return <p>Loading...</p>;
    if (error || queryError) return <p>Error: {error || queryError.message}</p>;
    if (!playlist) return <p>No playlist found</p>;

    return (
        <div className="w-full text-white">
            <div className="pt-4 w-full">
                <div className="flex flex-col">
                    {/* Play and Control Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3">
                                <MdPlayArrow size={24} />
                            </button>
                            <button className="flex items-center bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-4">
                                <MdShuffle size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Select All and Delete Button */}
                    <div className="flex items-center">
                        {isAnyCheckboxSelected() && (
                            <>
                                <div
                                    className="relative flex items-center p-2 rounded-lg mb-2 cursor-pointer"
                                    onClick={handleSelectAll}
                                >
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <MdCheckBoxOutlineBlank
                                                className="text-gray-400 cursor-pointer hover:text-gray-600"
                                                size={23}
                                            />
                                            {isSelectAllChecked && (
                                                <MdCheck
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400"
                                                    size={16}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button 
                                    onClick={handleDeleteSongs}
                                    className="flex items-center ml-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                    disabled={isRemoving}
                                >
                                    <MdDelete size={20} className="mr-2" />
                                    Xóa {selectedCheckboxes.size} bài hát
                                </button>
                            </>
                        )}
                    </div>

                    {/* Song List */}
                    <div className="flex flex-col gap-4 pt-2">
                        {playlist.songs.map((song, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                                ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""}`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => handleRowClick(song, index)}
                            >
                                {/* Checkbox */}
                                {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                                    <div
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4"
                                        style={{ zIndex: 2 }}
                                    >
                                        <div
                                            className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? 'text-gray-400' : 'text-gray-400'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCheckboxToggle(index);
                                            }}
                                        >
                                            <MdCheckBoxOutlineBlank size={23} />
                                            {selectedCheckboxes.has(index) && (
                                                <MdCheck
                                                    size={16}
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Song Index */}
                                <p
                                    className={`text-sm font-semibold w-8 text-center ${hoveredIndex === index || selectedCheckboxes.size > 0
                                        ? "opacity-0"
                                        : ""
                                        }`}
                                >
                                    {index + 1}
                                </p>

                                {/* Song Image */}
                                <img
                                    src={song.image}
                                    alt={song.title}
                                    className="w-14 h-14 object-cover rounded-lg ml-2"
                                />

                                {/* Song Details */}
                                <div className="flex flex-grow flex-col ml-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[400px]">
                                            {song.title}
                                        </p>

                                        <div className="absolute inset-0 flex items-center justify-end">
                                            <div className="absolute right-[200px]">
                                                <LikeButton songId={song.id} />
                                            </div>
                                            
                                            <p className={`text-gray-500 text-sm w-20 text-right ${
                                                hoveredIndex === index ? "opacity-0" : ""
                                            }`}>
                                                {formatDuration(song.duration)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-[430px]">
                                        {song.artistNames}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListSongOfPlaylist;