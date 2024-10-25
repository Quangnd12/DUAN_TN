import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getSongs, deleteSong } from "../../../../../../services/songs";
import DropdownMenu from "../../../../components/Dropdowns/dropdownMenu";
import DeleteSong from "./delete";
import PreviewSong from "./preview";
import PlayerControls from "../../../../components/audio/PlayerControls";
import { MdMoreVert } from "react-icons/md";
import { toast } from 'react-toastify';

const SongList = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalState, setModalState] = useState({ show: false, song: null });
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const songsPerPage = 10;
  
  const genres = ["V-Pop", "Pop", "R&B", "Funk", "Rock", "Hip-Hop"];

  useEffect(() => {
    fetchSongs();
  }, [currentPage, selectedGenres, searchQuery]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await getSongs();
      let filteredSongs = response;
      
      if (searchQuery) {
        filteredSongs = filteredSongs.filter(song => 
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedGenres.length > 0) {
        filteredSongs = filteredSongs.filter(song => 
          selectedGenres.includes(song.category)
        );
      }
      
      setSongs(filteredSongs);
    } catch (err) {
      setError("Failed to fetch songs");
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  // Added missing handler functions
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

  const handleRowClick = (song) => {
    if (activeDropdown === song.id) {
      return;
    }
    setSelectedRowId(song.id);
    setSelectedPlayer(song);
  };

  const handleAddSong = () => {
    navigate("/admin/song/add");
  };

  const handleEditSong = (id) => {
    navigate(`/admin/song/edit/${id}`);
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

  const closeModal = () => setModalState({ show: false, song: null });

  const toggleGenre = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full max-w-full">
      {/* Header section with search and buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative w-full md:w-auto mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search songs"
            className="pl-8 pr-4 py-2 border rounded-md bg-gray-200 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Table section */}
      <table className="w-full table-fixed min-w-full">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="text-left py-2 px-4 w-1/12">#</th>
            <th className="text-left py-2 px-4 w-1/2">SONG</th>
            <th className="text-left py-2 px-4 hidden sm:table-cell">CATEGORY</th>
            <th className="text-left py-2 px-4 hidden md:table-cell">ARTIST</th>
            <th className="text-left py-2 px-4 hidden lg:table-cell">ALBUM</th>
            <th className="text-left py-2 px-4 hidden sm:table-cell">DURATION</th>
            <th className="text-left py-2 px-4 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className={`border-b transition duration-200 cursor-pointer ${
                selectedRowId === song.id ? 'bg-[#e2eaf7]' : 'hover:bg-[#e2eaf7]'
              }`}
              onClick={() => handleRowClick(song)}
            >
              <td className="py-2 px-4 hidden sm:table-cell">{index + 1}</td>
              <td className="py-2 px-4 flex items-center">
                <img
                  src={song.image || '/placeholder.png'}
                  alt={song.title}
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-2 object-cover rounded"
                />
                <span className="truncate">{song.title}</span>
              </td>
              <td className="py-2 px-4 hidden sm:table-cell">{song.category}</td>
              <td className="py-2 px-4 hidden md:table-cell">{song.artist}</td>
              <td className="py-2 px-4 hidden lg:table-cell truncate">{song.album}</td>
              <td className="py-2 px-4 hidden sm:table-cell">{song.duration}</td>
              <td className="py-2 px-4 text-right">
                <button
                  onClick={(e) => handleDropdownClick(e, song.id)}
                  className="focus:outline-none"
                >
                  <MdMoreVert />
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

      {/* Modals and Player Controls */}
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
          title={selectedPlayer.title}
          artist={selectedPlayer.artist}
          Image={selectedPlayer.image}
          next={() => {/* Implement next track */}}
          prevsong={() => {/* Implement previous track */}}
          onTrackEnd={() => {/* Handle track end */}}
        />
      )}
    </div>
  );
};

SongList.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};

export default SongList;