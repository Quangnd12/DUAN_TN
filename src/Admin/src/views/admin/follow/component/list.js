import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';


const FollowList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);


    const songs = [
        {
            id: 1,
            user: 'user1',
            artist: 'Sơn Tùng',
            date:"11/11/2024"
        },
        {
            id: 1,
            user: 'user1',
            artist: 'Sơn Tùng' ,
            date:"11/11/2024"
        },

        {
            id: 1,
            user: 'user1',
            artist: 'Sơn Tùng',
            date:"11/11/2024"
        },
        {
            id: 1,
            user: 'user1',
            artist: 'Sơn Tùng',
            date:"11/11/2024"
        },

        {
            id: 1,
            user: 'user1',
            artist: 'Sơn Tùng',
            date:"11/11/2024"
        },
    ];


    return (
        <div className="bg-white shadow rounded-lg p-4 w-full max-w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="relative w-full md:w-auto mb-4 md:mb-0">
                    <input
                        type="text"
                        placeholder="Search song"
                        className="pl-8 pr-4 py-2 border rounded-md bg-gray-200 w-full md:w-64"
                    />
                    <i className="fas fa-search absolute left-2.5 top-3 text-gray-400"></i>
                </div>
                {/* <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">             
                    <div className="relative w-full md:w-auto">
                        <button
                            className="border px-4 py-2 rounded-md flex items-center w-full md:w-auto"
                            onClick={() => setShowActionMenu(!showActionMenu)}
                        >
                            Actions <i className="fas fa-chevron-down ml-2"></i>
                        </button>
                        {showActionMenu && (
                            <div className="absolute right-0 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg z-10">
                                <button
                                    onClick={() => console.log("Mass edit")}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Mass edit
                                </button>
                                <button
                                    onClick={() => console.log("Delete all")}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Delete all
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative w-full md:w-auto">
                        <button
                            className="border px-4 py-2 rounded-md flex items-center w-full md:w-auto"
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                        >
                            Filter <i className="fas fa-chevron-down ml-2"></i>
                        </button>
                        {showFilterMenu && (
                            <div className="absolute right-0 mt-2 w-full md:w-48 bg-white rounded-md shadow-lg z-10">
                                {genres.map((genre) => (
                                    <label
                                        key={genre}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedGenres.includes(genre)}
                                            onChange={() => toggleGenre(genre)}
                                            className="mr-2"
                                        />
                                        {genre}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div> */}
            </div>

            <table className="w-full table-fixed min-w-full">
                <thead>
                    <tr className="border-b bg-gray-200">
                        <th className="text-left py-2 px-4 w-1/12 sm:w-1/16 md:w-1/24 lg:w-0.5%">
                            #
                        </th>
                        <th className="text-left py-2 px-4 hidden sm:table-cell sm:w-1/6 md:w-1/6 lg:w-1/6">
                            NAME
                        </th>
                        <th className="text-left py-2 px-4 w-1/2 sm:w-1/3 md:w-1/2 lg:w-1/3">
                            ARTIST
                        </th>  
                         <th className="text-left py-2 px-4 w-1/2 sm:w-1/3 md:w-1/2 lg:w-1/3">
                            DATE
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr
                            key={song.id}
                            className="border-b transition duration-200 cursor-pointer "
                        >
                            <td className="py-2 px-4 hidden sm:table-cell">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 w-[250px] break-words">
                                {song.user}
                            </td>
                            <td className="py-2 px-4 w-[250px] break-words">
                                {song.artist}
                            </td> 
                            <td className="py-2 px-4 w-[250px] break-words">
                                {song.date}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                <span className="text-sm sm:text-base">Showing 1-5 of 1000</span>
                <div className="flex space-x-1">
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        <MdChevronLeft />
                    </button>
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        1
                    </button>
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        2
                    </button>
                    <button className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        3
                    </button>
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base" >
                        ...
                    </button>
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        100
                    </button>
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        <MdChevronRight />
                    </button>
                </div>
            </div>
        </div>

    );
};

FollowList.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};


export default FollowList;
