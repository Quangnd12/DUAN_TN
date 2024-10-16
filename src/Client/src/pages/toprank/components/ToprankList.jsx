import React, { useState, useEffect, useRef } from "react";
import data from "../../../data/fetchtopData";
import { useParams } from "react-router-dom";
// import data from "../../../data/fetchSongData";// Đảm bảo data chứa topRank
import { MdPlayArrow, MdShuffle, MdCheckBoxOutlineBlank, MdPlaylistAdd, MdCheck } from "react-icons/md";
import PlayerControls from "../../../components/audio/PlayerControls";
import SongItem from "../../../components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";
import LikeButton from "../../../components/button/favorite";
import MoreButton from "../../../components/button/more";
import { handleAddPlaylist } from "../../../components/notification";
import { AiFillPlayCircle, AiOutlineHeart, AiOutlineCalendar } from 'react-icons/ai'

const ListSongOfToprank = () => {
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
        console.log('Selected action:', action);
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
        setLikedSongs(prevLikedSongs => ({
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

    const { id } = useParams(); // Assuming id is the genre id you want to find
    let genreData = null;

    // Find the toprank that contains the desired genre (gender) within its gender array
    data.topranks.forEach((toprank) => {
        const foundGenre = toprank.gender.find(genre => genre.id === parseInt(id));
        if (foundGenre) {
            genreData = foundGenre;
        }
    });

    if (!genreData) {
        return <div className="text-gray-600">Genre not found.</div>;
    }


    return (
        <div className="relative w-full">
            <div className="flex w-full text-white p-4 rounded-md backdrop-filter backdrop-blur-md">
                {/* Sidebar: 3 phần */}
                <div className="w-1/3 p-4 flex flex-col flex-shrink-0">
                    <div className="mb-8">

                        {genreData.top100 && genreData.top100.length > 0 ? (
                            genreData.top100.map((song) => (
                                <div key={song.id} className="w-80 bg-black rounded-xl overflow-hidden shadow-2xl border border-purple-500 mb-4">
                                    <div className="p-4 relative">
                                        <div className="absolute inset-0 bg-purple-900 opacity-10 animate-pulse"></div>
                                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                                            {genreData.title}
                                        </h1>
                                        <div className="relative group mb-4">
                                            <img
                                                src={genreData.image}
                                                alt="Album Cover"
                                                className="w-full h-auto object-cover rounded-lg"
                                            />

                                            {/* Center the Play icon */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <AiFillPlayCircle className="w-12 h-12 text-white" />
                                            </div>

                                            <h2 className="text-xl font-semibold text-white mt-2 relative z-10 text-center">
                                                {song.song}
                                            </h2>
                                        </div>

                                        <div className="flex items-center justify-between text-purple-300 text-sm mb-2 relative z-10">
                                            <span className="flex items-center">
                                                <AiOutlineCalendar className="w-4 h-4 mr-1" />
                                                {new Date().toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center">
                                                <AiOutlineHeart className="w-4 h-4 mr-1 text-pink-500" />
                                                {song.likes}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm relative z-10">
                                            {genreData.popularArtists.length > 3
                                                ? `${genreData.popularArtists.slice(0, 3).join(", ")}...`
                                                : genreData.popularArtists.join(", ")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center">Không có bài hát nào cho thể loại này.</p>
                        )}
                    </div>
                </div>



                {/* Main content: 7 bài hát */}
                <div className="w-2/3 p-4 scroll-hidden smooth-scroll h-screen">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <button className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3">
                                    <MdPlayArrow size={24} />
                                </button>
                                <div className="ml-6">
                                    <LikeButton
                                        likedSongs={likedSongs[0]}
                                        handleLikeToggle={() => handleLikeToggle(0)}
                                    />
                                </div>
                                <div className="ml-6">
                                    <MoreButton type="albumPlaylist" onOptionSelect={handleOptionSelect} />
                                </div>
                            </div>
                            <button className="flex items-center bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition">
                                <MdShuffle size={24} />
                            </button>
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
                                    <p className="text-gray-400 text-sm mr-2" onClick={handleAddPlaylist}>Add to playlist</p>
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
                                            align={'right'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {selectedPlayer && (
                <div className="fixed bottom-0 left-0 w-full bg-black p-4 z-50">
                    <PlayerControls
                        title={selectedPlayer.name}
                        artist={selectedPlayer.artist}
                        Image={selectedPlayer.image}
                        next={() => {/*  next track */ }}
                        prevsong={() => {/*  previous track */ }}
                        onTrackEnd={() => {/* Handle track end */ }}
                    />
                </div>
            )}
        </div>
    );
};

export default ListSongOfToprank;
