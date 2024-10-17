import React, { useState, useEffect, useRef } from "react";
import data from "../../../data/fetchSongData";
import { MdPlayArrow, MdShuffle, MdCheckBoxOutlineBlank, MdPlaylistAdd, MdCheck } from "react-icons/md";
import PlayerControls from "../../../components/audio/PlayerControls";
import SongItem from "../../../components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";
import LikeButton from "../../../components/button/favorite";
import MoreButton from "../../../components/button/more";
import { handleAddPlaylist } from "../../../components/notification";

const TopChartList = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [likedSongs, setLikedSongs] = useState({});
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

    const dropdownRefs = useRef({});

    const handleRowClick = (song, index) => {
        setSelectedPlayer(song);
        setClickedIndex(index);
    };

    const handleOptionSelect = (action) => {
        console.log("Selected action:", action);
    };

    const handleCheckboxToggle = (index) => {
        setSelectedCheckboxes((prevSelectedCheckboxes) => {
            const updatedCheckboxes = new Set(prevSelectedCheckboxes);
            if (updatedCheckboxes.has(index)) {
                updatedCheckboxes.delete(index);
            } else {
                updatedCheckboxes.add(index);
            }

            if (updatedCheckboxes.size === data.songs.length) {
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
            const allIndices = data.songs.map((_, idx) => idx);
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

    return (
        <div className="pt-4 w-full text-white">
            <div className="flex flex-col">
                {/* Tiêu đề lớn "Top Chart" */}
                <h2 className="text-7xl font-bold mb-20">Top Chart</h2>
                
                {/* Đường kẻ phía trên các cột */}
                <div className="flex justify-between border-b border-gray-600 pb-2 mb-4">
                  
                    <p className="text-lg font-semibold w-48">SONG</p>
                    <p className="text-lg font-semibold w-48 ml-[130px]">ALBUM</p>
                    <p className="text-lg font-semibold w-20 text-right mr-[20px]">DURATION</p>
                </div>

                <div className="flex">
                    {isAnyCheckboxSelected() && (
                        <div
                            className="relative flex items-center p-2 rounded-lg mb-2 cursor-pointer"
                            onClick={handleSelectAll}
                        >
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
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
                    )}

                    {isAnyCheckboxSelected() && (
                        <div className="ml-6 relative flex items-center p-1 w-400 rounded-3xl border border-gray-600 cursor-pointer bg-black mb-2">
                            <MdPlaylistAdd size={23} className="text-gray-400 mr-2 ml-2" />
                            <p className="text-gray-400 text-sm mr-2" onClick={handleAddPlaylist}>
                                Add to playlist
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 pt-2">
                    {data.songs.map((song, index) => (
                        <div
                            key={index}
                            className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                            ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleRowClick(song, index)}
                        >
                            {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4" style={{ zIndex: 2 }}>
                                    <div
                                        className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? "text-gray-400" : "text-gray-400"}`}
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
                            <p className={`text-sm font-semibold w-8 text-center ${hoveredIndex === index || selectedCheckboxes.size > 0 ? "opacity-0" : ""}`}>
                                {index + 1}
                            </p>
                            <img src={song.image} alt={song.name} className="w-14 h-14 object-cover rounded-lg ml-2" />
                            <div className="flex flex-grow flex-col ml-3 relative">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold w-48">{song.name}</p>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-gray-500 text-sm text-center">{"Havana"}</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-end">
                                        <p className={`text-gray-500 text-sm w-20 text-right ${hoveredIndex === index ? "opacity-0" : ""}`}>
                                            {song.duration}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-1">{song.artist}</p>
                                <SongItem
                                    key={index}
                                    song={song}
                                    index={index}
                                    hoveredIndex={hoveredIndex}
                                    clickedIndex={clickedIndex}
                                    setHoveredIndex={setHoveredIndex}
                                    setClickedIndex={setClickedIndex}
                                    likedSongs={likedSongs}
                                    handleLikeToggle={handleLikeToggle}
                                    handleDropdownToggle={handleDropdownToggle}
                                    dropdownIndex={dropdownIndex}
                                    dropdownRefs={dropdownRefs}
                                    setShowShareOptions={setShowShareOptions}
                                    showShareOptions={showShareOptions}
                                    align={"right"}
                                />
                                {selectedPlayer && (
                                    <PlayerControls
                                        title={selectedPlayer.name}
                                        artist={selectedPlayer.artist}
                                        Image={selectedPlayer.image}
                                        next={() => {
                                            /* next track */
                                        }}
                                        prevsong={() => {
                                            /* previous track */
                                        }}
                                        onTrackEnd={() => {
                                            /* Handle track end */
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopChartList;
