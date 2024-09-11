import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import DropdownMenu from "../../../../components/Dropdowns/dropdownMenu";
import DeleteSong from "./delete";
import PreviewSong from "./preview";
import PlayerControls from "../../../../components/audio/PlayerControls";

const SongList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalState, setModalState] = useState({ show: false, song: null });
  const [showPreview, setShowPreview] = useState(false);
  const songsPerPage = 10;

  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleRowClick = (song) => {
    if (activeDropdown === song.id) {
      // Nếu dropdown đang mở, không thực hiện hành động chọn hàng
      return;
    }
    setSelectedRowId(song.id);
    setSelectedPlayer(song);
    // Thực hiện hành động phát nhạc ở đây
  };

  const handlePreviewClick = (id) => {
    const song = songs.find(song => song.id === id);
    setSelectedSong(song);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedSong(null);
  };
  // Sample song data
  const handleAddSong = () => {
    navigate("/admin/song/add"); // Điều hướng đến trang thêm bài hát
  };

  const handleEditSong = (id) => {
    navigate(`/admin/song/edit/${id}`);
  };


  const songs = [
    {
      id: 1,
      name: "Chúng ta của tương lai",
      category: "V-Pop",
      artist: "Sơn Tùng MTP",
      description: "Latest hit from Sơn Tùng MTP...",
      image:
        "https://th.bing.com/th/id/OIP.5sdXslc5LTHn1l0WpI-n9AHaHa?rs=1&pid=ImgDetMain",
      album: "Sky tour",
      duration: "03:04",
      releaseDate: "11/11/2018"
    },
    {
      id: 2,
      name: "Lạc trôi",
      category: "V-Pop",
      artist: "Sơn Tùng MTP",
      description: "Popular song from Sơn Tùng MTP...",
      image: "https://i.ytimg.com/vi/DrY_K0mT-As/maxresdefault.jpg",
      album: "Sky tour",
      duration: "03:04",
      releaseDate: "11/11/2018"
    },
    {
      id: 3,
      name: "Shape of You",
      category: "Pop",
      artist: "Ed Sheeran",
      description: "Hit song from Ed Sheeran's album ÷...",
      image:
        "https://th.bing.com/th/id/OIP.EHwrQ_EMJJB3wfdhhWO7YwHaHa?rs=1&pid=ImgDetMain",
      album: "Sky tour",
      duration: "03:04",
      releaseDate: "11/11/2018"
    },
    {
      id: 4,
      name: "Blinding Lights",
      category: "R&B",
      artist: "The Weeknd",
      description: "Chart-topping hit from The Weeknd...",
      image:
        "https://th.bing.com/th/id/R.68448df596cd3fbba0cca9bae732b767?rik=77B%2b0CVfFWikBg&pid=ImgRaw&r=0",
      album: "Sky tour",
      duration: "03:04",
      releaseDate: "11/11/2018"
    },
    {
      id: 5,
      name: "Uptown Funk",
      category: "Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      description: "Funk-pop collaboration...",
      image:
        "https://th.bing.com/th/id/OIP.B5Y33cHKwW6x3cCVxqhdrQHaEK?rs=1&pid=ImgDetMain",
      album: "Sky tour",
      duration: "03:04",
      releaseDate: "11/11/2018"
    },
  ];

  const genres = ["V-Pop", "Pop", "R&B", "Funk", "Rock", "Hip-Hop"];

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

  const handleDeleteClick = (songId) => {
    const song = songs.find(s => s.id === songId);
    setModalState({ show: true, song });
  };

  const closeModal = () => setModalState({ show: false, song: null });


  return (
    <div className="bg-white shadow rounded-lg p-4 w-full max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative w-full md:w-auto mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search songs"
            className="pl-8 pr-4 py-2 border rounded-md bg-gray-200 w-full md:w-64"
          />
          <i className="fas fa-search absolute left-2.5 top-3 text-gray-400"></i>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            onClick={handleAddSong}
          >
            + Add song
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
              SONG
            </th>
            <th className="text-left py-2 px-4 hidden sm:table-cell sm:w-1/6 md:w-1/6 lg:w-1/6">
              CATEGORY
            </th>
            <th className="text-left py-2 px-4 hidden md:table-cell md:w-1/6 lg:w-1/6">
              ARTIST
            </th>
            <th className="text-left py-2 px-4 hidden lg:table-cell lg:w-1/6">
              ALBUM
            </th>
            <th className="text-left py-2 px-4 hidden sm:table-cell sm:w-1/6 md:w-1/6 lg:w-1/6">
              DURATION
            </th>
            <th className="text-left py-2 px-4 w-8 sm:w-12 md:w-16 lg:w-1/12"></th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className={`border-b transition duration-200 cursor-pointer ${selectedRowId === song.id ? 'bg-[#e2eaf7]' : 'hover:bg-[#e2eaf7]'}`}
              onClick={() => handleRowClick(song)}
            >
              <td className="py-2 px-4 hidden sm:table-cell">
                {index + 1}
              </td>
              <td className="py-2 px-4 flex items-center">
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-2 object-cover rounded"
                />
                <span className="truncate">{song.name}</span>
              </td>
              <td className="py-2 px-4 hidden sm:table-cell">
                {song.category}
              </td>
              <td className="py-2 px-4 hidden md:table-cell">
                {song.artist}
              </td>
              <td className="py-2 px-4 hidden lg:table-cell truncate">
                {song.album}
              </td>
              <td className="py-2 px-4 hidden sm:table-cell">
                {song.duration}
              </td>
              <td className="py-2 px-4 text-right ">
                <button
                  onClick={(e) => handleDropdownClick(e, song.id)}
                  className="focus:outline-none"
                >
                  <i className="fas fa-ellipsis-v cursor-pointer "></i>
                </button>
                <DropdownMenu
                  isOpen={activeDropdown === song.id}
                  onToggle={() => handleToggleDropdown(song.id)}
                  onEdit={() => handleEditSong(song.id)}
                  onPreview={() => handlePreviewClick(song.id)}
                  onDelete={() => handleDeleteClick(song.id)}
                />
              </td>
            </tr>
          ))}
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
      {modalState.show && (
        <DeleteSong
          onClose={closeModal}
          songToDelete={modalState.song}
        />
      )}
      <PreviewSong
        showModal={showPreview}
        onClose={handleClosePreview}
        song={selectedSong}
      />
      {selectedPlayer && (
        <PlayerControls
          title={selectedPlayer.name}
          artist={selectedPlayer.artist}
          Image={selectedPlayer.image}
          next={() => {/* Implement next track */ }}
          prevsong={() => {/* Implement previous track */ }}
          onTrackEnd={() => {/* Handle track end */ }}
        />
      )}
    </div>

  );
};

SongList.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};


export default SongList;
