import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DropdownMenu from "../../../../components/Dropdowns/dropdownMenu";
import { MdMoreVert } from "react-icons/md";
import DeleteArtist from "./delete";
import { handleDelete } from "../../../../components/notification";
import { getGenres } from "../../../../../../services/genres";


const GenreList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [modalState, setModalState] = useState({ show: false, song: null });
    const songsPerPage = 10;
    const [Genres, setGenres] = useState([]);


    useEffect(() => {
        GenreData();
    }, []);

    const GenreData = async () => {
        try {
            const data = await getGenres();
            setGenres(data);
        } catch (error) {
            console.log("Không tìm thấy dữ liệu");
        }
    }

    const handleAddSong = () => {
        navigate("/admin/genre/add");
    };

    const handleEditSong = (id) => {
        navigate(`/admin/genre/edit/${id}`);
    };

    const genres = ["Mới nhất", "Nổi bật nhất", "Cũ nhất"];

    const toggleGenre = (genre) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.includes(genre)
                ? prevGenres.filter((g) => g !== genre)
                : [...prevGenres, genre]
        );
    };



    const handleToggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleDropdownClick = (e, id) => {
        e.stopPropagation();
        handleToggleDropdown(id);
    };

    // const handleDeleteClick = (songId) => {
    //     const song = songs.find(s => s.id === songId);
    //     setModalState({ show: true, song });
    //     handleDelete()
    // };

    const closeModal = () => setModalState({ show: false, song: null });


    return (
        <div className="bg-white shadow rounded-lg p-4 w-full max-w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="relative w-full md:w-auto mb-4 md:mb-0">
                    <input
                        type="text"
                        placeholder="Search album"
                        className="pl-8 pr-4 py-2 border rounded-md bg-gray-200 w-full md:w-64"
                    />
                    <i className="fas fa-search absolute left-2.5 top-3 text-gray-400"></i>
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                        onClick={handleAddSong}
                    >
                        + Add album
                    </button>
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
                </div>
            </div>

            <table className="w-full table-fixed min-w-full">
                <thead>
                    <tr className="border-b bg-gray-200">
                        <th className="text-left py-2 px-4 w-1/12 sm:w-1/16 md:w-1/24 lg:w-0.5%">
                            #
                        </th>
                        <th className="text-left py-2 px-4 w-1/2 sm:w-1/3 md:w-1/2 lg:w-1/3">
                            NAME
                        </th>
                        <th className="text-left py-2 px-4 hidden sm:table-cell sm:w-1/6 md:w-1/6 lg:w-1/6">
                            IMAGE
                        </th>
                        <th className="text-left py-2 px-4 hidden md:table-cell md:w-1/6 lg:w-1/6">
                            GENRE
                        </th>
                        <th className="text-center py-2 px-4 hidden md:table-cell md:w-1/6 lg:w-1/6">
                            DES
                        </th>
                        <th className="text-left py-2 px-4 w-8 sm:w-12 md:w-16 lg:w-1/12"></th>
                    </tr>
                </thead>
                <tbody>
                    {Genres && Genres.length > 0 ? (
                        Genres.map((genre, index) => (
                            <tr
                                // key={genre.id}
                                className={`border-b transition duration-200 cursor-pointer`}
                            >
                                <td className="py-2 px-4 hidden sm:table-cell">
                                    {index + 1}
                                </td>
                                <td className="py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis w-[250px]">
                                    {genre.name}
                                </td>
                                <td className="py-2 px-4 hidden sm:table-cell">
                                    <img
                                        src={genre.image}
                                        alt={genre.name}
                                        className="w-8 h-8 sm:w-10 sm:h-10 mr-2 object-cover rounded"
                                    />
                                </td>
                                <td className="py-2 px-4 hidden md:table-cell">
                                    {Array.isArray(genre.subgenres)
                                        ? genre.subgenres.map(subgenre => subgenre.name).join(', ')
                                        : typeof genre.subgenres === 'object'
                                            ? JSON.stringify(genre.subgenres)
                                            : genre.subgenres}
                                </td>
                                <td className="py-2 px-4 hidden md:table-cell text-center">
                                    {genre.description}
                                </td>
                                <td className="py-2 px-4 text-right ">
                                    <button
                                        onClick={(e) => handleDropdownClick(e, genre.id)}
                                        className="focus:outline-none"
                                    >
                                        <MdMoreVert />
                                    </button>
                                    <DropdownMenu
                                        isOpen={activeDropdown === genre.id}
                                        onToggle={() => handleToggleDropdown(genre.id)}
                                        // onEdit={() => handleEditgenre(genre.id)}
                                        // onDelete={() => handleDeleteClick(genre.id)}
                                        showPreview={null}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                No genres available.
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                <span className="text-sm sm:text-base">Showing 1-5 of 1000</span>
                <div className="flex space-x-1">
                    <button className="border px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base">
                        <i className="fas fa-chevron-left"></i>
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
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            {/* {modalState.show && (
                <DeleteArtist
                    onClose={closeModal}
                    songToDelete={modalState.song}
                />
            )} */}
        </div>

    );
};

GenreList.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};


export default GenreList;
