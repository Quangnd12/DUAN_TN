import React, { useState, useEffect, useRef,useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Menu, MenuItem, CircularProgress, Pagination, Typography, Alert, Stack, Collapse, Box, Avatar, Backdrop,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { MdEdit, MdDelete, MdPlayArrow } from 'react-icons/md';
import { getSongs } from "../../../../../../services/songs.jsx";

import DeleteSong from "./delete";
import { formatDate, formatDuration } from "Admin/src/components/formatDate";
import PlayerControls from "../../../../components/audio/PlayerControls";
import { usePlayerContext } from "Admin/src/components/audio/playerContext";
import { getGenres } from "services/genres";
import RangeSliderField from "Admin/src/components/SharedIngredients/RangeSliderField";
import debounce from "lodash.debounce";

const SongList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // Quản lý anchorEl cho menu
  const [selectedSong, setSelectedSong] = useState(null); // Quản lý genre được chọn
  const [openRow, setOpenRow] = useState({});
  const [Songs, setSongs] = useState([]);
  const [songToDelete, setsongToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const { selectedPlayer, setSelectedPlayer, isPlayerVisible, setIsPlayerVisible } = usePlayerContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [Genres, setGenres] = useState([]);
  const [limit, setLimit] = useState(5);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [minDuration, setMinDuration] = useState(180);
  const [maxDuration, setMaxDuration] = useState(300);
  const [minListen, setMinListen] = useState(0);
  const [maxListen, setMaxListen] = useState(100000);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);


  const [expandedLyrics, setExpandedLyrics] = useState({});

  const handleToggleLyrics = (songId) => {
    setExpandedLyrics((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const handleRowClick = (song, index) => {
    setSelectedPlayer(song);
    setIsPlayerVisible(true);
  };

  useEffect(() => {
    return () => {
      setIsPlayerVisible(false);
    };
  }, [location.pathname, setIsPlayerVisible]);



  const SongData = async (page = 1, limit = 5, search = '', genres = [], minDuration = 0, maxDuration = 0, minListensCount = 0,maxListensCount=0) => {
    try {
      const data = await getSongs(page, limit, search, genres, minDuration, maxDuration, minListensCount,maxListensCount);
      setSongs(data.songs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log("Không tìm thấy dữ liệu");
    }
  };


 

  useEffect(() => {
    SongData(currentPage, limit, searchName, selectedGenres, minDuration, maxDuration, minListen, maxListen);
  
  }, [currentPage, limit, searchName, selectedGenres, minDuration, maxDuration, minListen, maxListen]);


  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleFilterChange = (event, genreID) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedGenres(prev => [...prev, genreID]);
    } else {
      setSelectedGenres(prev => prev.filter(id => id !== genreID));
    }
  };

  const filterGenresWithSongs = (genres, songs) => {
    return genres.filter(genre =>
      songs.some(song => song.genre === genre.name)
    );
  };

  const GenreData = async () => {
    try {
      const GenreData = await getGenres();  
      const SongData = await getSongs();  
      const filtered = filterGenresWithSongs(GenreData.genres, SongData.songs);
      setGenres(filtered);  
    } catch (error) {
      console.log("Có lỗi khi lấy dữ liệu:", error);
    }
  };


  useEffect(() => {
    GenreData();
  }, []);

  const playTrack = (track) => {
    if (selectedPlayer?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {

      setSelectedPlayer(track);
      setIsPlaying(true); 
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setSelectedPlayer(null);
    }
  }, [isPlaying]);

  const handleOpenMenu = (event, song) => {
    setAnchorEl(event.currentTarget);
    setSelectedSong(song);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSong(null); // Đóng menu khi không chọn
  };


  const handleDeleteSong = (id) => {
    setSongs(prevGenres => prevGenres.filter(song => song.id !== id));
  };

  const handleOpenDeleteModal = (song) => {
    setsongToDelete(song);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setsongToDelete(null);
  };

  const toggleRow = (id) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getInitials = (username) => {
    if (!username) return "";
    const names = username.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
  };

  const getColorFromName = (name) => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[(name.charCodeAt(i % name.length) + i) % 14]; // Dùng tên của subgenre để tạo màu cố định
    }
    return color;
  };

  const handleAddSong = () => {
    navigate("/admin/song/add");
  };
  const handleEditsong = (id) => {
    navigate(`/admin/song/edit/${id}`);
  };

  const handleDurationChange = (newValue) => {
    const [min, max] = newValue;
    setMinDuration(min); // Cập nhật giá trị minDuration
    setMaxDuration(max); // Cập nhật giá trị maxDuration


  };


  const handleListenChange = (newValue) => {
    const [min, max] = newValue;
    setMinListen(min); // Cập nhật giá trị minDuration
    setMaxListen(max); // Cập nhật giá trị maxDuration
  };

   const handleClickOutside = (event) => {
        if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
          setShowFilterMenu(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); 
        return () => {
          document.removeEventListener('mousedown', handleClickOutside); 
        };
      }, []);

  return (
    <div className="p-4">
      {/* <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <div className="flex justify-between mb-4">
        <div className="flex-grow">
          <TextField
            label="Search"
            variant="outlined"
            value={searchName}
            onChange={handleSearchChange}
            className="w-64"
            placeholder="Search..."
          />
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            onClick={handleAddSong}
          >
            + Add song
          </button>
          <div className="relative w-full md:w-auto">
            <button
              className="border px-4 py-2 rounded-md flex items-center w-full md:w-auto"
              onClick={() => setShowFilterMenu(prev => !prev)}
            >
              Filter <i className="fas fa-chevron-down ml-2"></i>
            </button>
            {showFilterMenu && (
              <div ref={filterMenuRef} className="absolute right-0 mt-2 w-full md:w-96 bg-white rounded-md shadow-lg z-100">
                <div className="px-4 py-2">
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Genres</h4>
                  {Genres.map((genre, index) => (
                    <label
                      key={index}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.id)}
                        onChange={(e) => handleFilterChange(e, genre.id)}
                        className="mr-2"
                      />
                      {genre.name}
                    </label>
                  ))}
                </div>
                <div className="px-4 py-2 w-[370px]">
                  <RangeSliderField
                    label="Duration (Seconds)"
                    min={180}
                    max={300}
                    value={[minDuration, maxDuration]}
                    onChange={handleDurationChange}
                    onAfterChange={handleDurationChange}
                  />

                </div>
                <div className="px-4 py-2 w-[370px]">
                <RangeSliderField
                    label="Listens"
                    min={0}
                    max={100000}
                    value={[minListen, maxListen]}
                    onChange={handleListenChange}
                    onAfterChange={handleListenChange}
                  />
                </div>
              </div>
            )}
          </div>
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
        </div>
      </div>

      {Songs?.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell />
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Song</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist</TableCell>
                  <TableCell sx={{ color: "white" }}>Country</TableCell>
                  <TableCell sx={{ color: "white" }}>Album</TableCell>
                  <TableCell sx={{ width: "70px", color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Songs.map((song, index) => (
                  <React.Fragment key={song.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(song.id)}
                        >
                          {openRow[song.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>
                            {song.image ? (
                              <img
                                src={`${song.image}`}
                                alt={song.name || "Avatar"}
                                className="w-10 h-10 rounded-md"
                              />
                            ) : (
                              <Avatar>{getInitials(song.name)}</Avatar>
                            )}
                          </span>
                          <span className="ml-2">
                            {song.title || "No songname"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {song.artist}
                      </TableCell >
                      <TableCell>{song.country}</TableCell>
                      <TableCell>
                        {song.album}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleOpenMenu(event, song)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedSong?.id === song.id}
                          onClose={handleCloseMenu}

                        >
                          <MenuItem onClick={() => {
                            handleCloseMenu();
                            handleEditsong(song.id);
                          }
                          } >
                            <MdEdit style={{ marginRight: '8px', color: 'blue' }} /> {/* Icon sửa */}
                            <span style={{ color: 'blue' }}>Edit</span>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleCloseMenu();
                              handleOpenDeleteModal(song);
                            }}
                          >
                            <MdDelete style={{ marginRight: '8px', color: "red" }} />
                            <span style={{ color: 'red' }}>Delete</span>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={openRow[song.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                              <div className="flex mr-2">
                                Additional Information
                                <button className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3"
                                  onClick={() => handleRowClick(song)}
                                >
                                  <MdPlayArrow size={24} />
                                </button>
                              </div>

                            </Typography>
                            <Typography variant="body1" className="pb-2">Genres: </Typography>
                            {typeof song.genre === 'string' && song.genre.trim() !== '' ? (
                              <div className="flex flex-wrap">
                                {song.genre.split(',').map((genreName) => {
                                  const trimmedName = genreName.trim();
                                  return (
                                    <Typography
                                      key={trimmedName}
                                      variant="body2"
                                      component="div"
                                      style={{
                                        backgroundColor: getColorFromName(trimmedName),
                                        color: '#fff',
                                        padding: '4px 12px',
                                        marginRight: '8px',
                                        marginBottom: '4px',
                                        borderRadius: '16px',
                                      }}
                                    >
                                      {trimmedName}
                                    </Typography>
                                  );
                                })}
                              </div>
                            ) : (
                              <Typography variant="body2" component="div">
                                No genres available
                              </Typography>
                            )}
                            <Typography variant="body1" className="pb-2 pt-2">Duration: {formatDuration(song.duration)}</Typography>
                            <Typography variant="body1" className="pb-2 ">release date: {formatDate(song.releaseDate)}</Typography>
                            <Typography variant="body1" className="pb-2">Play count: {song.listens_count}</Typography>
                            <Typography variant="body1" className="pb-2">
                              Lyrics: {expandedLyrics[song.id] ? song.lyrics : `${song.lyrics.substring(0, 100)}...`}
                              {song.lyrics.length > 100 && (
                                <span
                                  onClick={() => handleToggleLyrics(song.id)}
                                  style={{ color: 'blue', cursor: 'pointer', marginLeft: '4px', fontSize: '16px' }}
                                >
                                  {expandedLyrics[song.id] ? ' Show less' : 'Show more'}
                                </span>
                              )}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label htmlFor="limit">Show items:</label>
              <select id="limit" value={limit} onChange={handleLimitChange} className="border border-gray-300 rounded p-1">
                <option value={5}>Show 5</option>
                <option value={10}>Show 10</option>
                <option value={15}>Show 15</option>
              </select>
            </div>
            <div>
              <Stack spacing={2}>
                <Pagination
                  count={totalPages || 1}
                  page={currentPage}
                  onChange={handleChangePage}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            </div>
          </div>
        </>
      ) : (
        <Alert severity="warning">No song found matching the search keyword.</Alert>
      )}
      {selectedPlayer && (
        <PlayerControls
          title={selectedPlayer.title}
          artist={selectedPlayer.artist}
          Image={selectedPlayer.image}
          next={() => {/* Implement next track */ }}
          prevsong={() => {/* Implement previous track */ }}
          onTrackEnd={() => {/* Handle track end */ }}
          audioUrl={selectedPlayer.file_song}
        />
      )}
      {/* Modal xóa */}
      {openDeleteModal && (
        <DeleteSong
          onClose={handleCloseDeleteModal}
          songDelete={songToDelete}
          onDelete={handleDeleteSong}
        />
      )}
    </div>
  );
};

export default SongList;

