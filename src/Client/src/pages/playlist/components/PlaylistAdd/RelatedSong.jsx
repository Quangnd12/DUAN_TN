import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "../../../../data/fetchSongData";
import { MdPlayArrow, MdShuffle, MdCheckBoxOutlineBlank, MdCheck } from "react-icons/md";
import PlayerControls from "../../../../components/audio/PlayerControls";
import SongItem from "../../../../components/dropdown/dropdownMenu";
import "../../../../assets/css/artist/artist.css";
import MoreButton from "../../../../components/button/more";


const RelatedSong = ({onAddSong}) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    return (
        <div className="w-full text-white p-4 bg-zinc-900 rounded-md  mt-4">
            <div className="flex flex-col">
                <h2 className="text-2xl text-white font-bold mb-6">Popular song</h2>
                <div className="flex">
                </div>
                <div className="flex flex-col gap-4 pt-2">
                    {data.songs.slice(0, 6).map((song, index) => (
                        <div
                            key={index}
                            className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                    `}
                        >
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4" style={{ zIndex: 2 }} >
                                <div
                                    className={`relative cursor-pointer `}
                                >
                                </div>
                            </div>
                            <img
                                src={song.image}
                                alt={song.name}
                                className="w-14 h-14 object-cover rounded-lg ml-2"
                            />
                            <div className="flex flex-grow flex-col ml-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold  whitespace-nowrap overflow-hidden text-ellipsis w-[370px]">
                                        {song.name}
                                    </p>
                                    <div className="absolute top-[25px] justify-end right-[200px]">
                                        <Link to={"/album/2"}>
                                            <p className="text-gray-500 text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis w-[370px] hover:text-blue-500 hover:underline no-underline">
                                                {"Sky tour"}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="absolute top-[19px] justify-end right-[10px]">
                                        <button className="text-gray-400 ml-2 border border-gray-600 p-1 rounded-[30px] w-[80px] text-center flex items-center justify-center hover:text-white hover:bg-blue-500"
                                       onClick={() => onAddSong(song)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis w-[350px]">
                                    {song.artist}
                                </div>

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

export default RelatedSong;
