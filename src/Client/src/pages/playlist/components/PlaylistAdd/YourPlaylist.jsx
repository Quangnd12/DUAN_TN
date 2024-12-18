import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "../../../../data/fetchSongData";
import { MdPlayArrow, MdShuffle, MdCheckBoxOutlineBlank, MdCheck } from "react-icons/md";
import PlayerControls from "../../../../components/audio/PlayerControls";
import SongItem from "../../../../components/dropdown/dropdownMenu";
import "../../../../assets/css/artist/artist.css";
import MoreButton from "../../../../components/button/more";


const YourPlayList = ({ playlistAdd }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [likedSongs, setLikedSongs] = useState({});
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    

    const dropdownRefs = useRef({});
    const MAX_ARTISTS_TO_SHOW = 4;

    const handleRowClick = (song, index) => {
        setSelectedPlayer(song);
        setClickedIndex(index);
    };


    const handleCheckboxToggle = (index) => {
        setSelectedCheckboxes(prevSelectedCheckboxes => {
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
    const handleOptionSelect = (action) => {
        console.log('Selected action:', action);
        // Xử lý action tại đây
    };

    return (
        <div className="pt-4  w-full text-white ">
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        {playlistAdd.length > 0 ?
                            <button className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3">
                                <MdPlayArrow size={24} />
                            </button>
                            : ""}
                        <div className="ml-8">
                            <MoreButton type="playlist" onOptionSelect={handleOptionSelect} />
                        </div>
                    </div>
                    {playlistAdd.length > 0 ?
                        <button className="flex items-center bg-icon text-white p-2 mr-4 rounded-full hover:bg-blue-700 transition">
                            <MdShuffle size={24} />
                        </button>
                        : ""}
                </div>
                <div className="flex">
                    {isAnyCheckboxSelected() && (
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
                                <p className="text-gray-400 ml-2 border border-gray-600 p-1 rounded-[30px] w-[100px] text-center flex items-center justify-center">
                                    Select all
                                </p>
                            </div>
                        </div>
                    )}

                </div>
                <div className="flex flex-col gap-4 pt-2">
                    {playlistAdd.map((song, index) => (
                        <div
                            key={index}
                            className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                   ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleRowClick(song, index)}
                        >
                            {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4" style={{ zIndex: 2 }} >
                                    <div
                                        className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? 'text-gray-400' : 'text-gray-400'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCheckboxToggle(index);

                                        }}
                                    >
                                        <MdCheckBoxOutlineBlank size={23} />
                                        {selectedCheckboxes.has(index) && (
                                            <MdCheck size={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            )}
                            <p className={`text-sm font-semibold w-8 text-center ${hoveredIndex === index || selectedCheckboxes.size > 0 ? "opacity-0" : ""}`}>
                                {index + 1}
                            </p>
                            <img
                                src={song.image}
                                alt={song.name}
                                className="w-14 h-14 object-cover rounded-lg ml-2"
                            />
                            <div className="flex flex-grow flex-col ml-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold w-48 whitespace-nowrap overflow-hidden text-ellipsis w-[370px]">
                                        {song.name}
                                    </p>
                                    <div className="absolute top-[25px] justify-end right-[200px]">
                                        <Link to={"/listalbum/2"}>
                                            <p className="text-gray-500 text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis w-[370px] hover:text-blue-500 hover:underline no-underline">
                                                {"Sky tour"}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="absolute top-[25px] justify-end right-[10px]">
                                        <p
                                            className={`text-gray-500 text-sm w-20 text-right mr-2 ${hoveredIndex === index ? "opacity-0" : ""
                                                }`}
                                        >
                                            {song.duration}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1" style={{ zIndex: 1 }}>
                                    {song.artist.split(", ").slice(0, MAX_ARTISTS_TO_SHOW).map((artist, artistIndex, array) => (
                                        <span key={artistIndex} className="flex items-center">
                                            <Link to={`/artist/${artistIndex + 1}`}>
                                                <p className="text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-500 hover:underline">
                                                    {artist}
                                                </p>
                                            </Link>
                                            {artistIndex < array.length - 1 && <span className="text-gray-400">, </span>}
                                        </span>
                                    ))}
                                    {song.artist.split(", ").length > MAX_ARTISTS_TO_SHOW && (
                                        <span className="text-gray-400">... </span>
                                    )}
                                </div>
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
                                    align={'right'}
                                    type="playlist" 
                                />
                                {selectedPlayer && (
                                    <PlayerControls
                                        title={selectedPlayer.name}
                                        artist={selectedPlayer.artist}
                                        Image={selectedPlayer.image}
                                        next={() => {/*  next track */ }}
                                        prevsong={() => {/*  previous track */ }}
                                        onTrackEnd={() => {/* Handle track end */ }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default YourPlayList;
