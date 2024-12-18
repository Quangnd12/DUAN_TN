import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Menu, MenuItem, Tooltip, Pagination, Typography, Alert, Stack, Collapse, Box, Avatar, Backdrop,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { MdEdit, MdDelete, MdPlayArrow, MdContentCopy } from 'react-icons/md';
import { getSongs } from "../../../../../../services/songs";

import DeleteSong from "./delete";
import { formatDate, formatDuration } from "Admin/src/components/formatDate";
import PlayerControls from "../../../../components/audio/PlayerControls";
import { usePlayerContext } from "Admin/src/components/audio/playerContext";
import { getGenres } from "../../../../../../services/genres";
import RangeSliderField from "Admin/src/components/SharedIngredients/RangeSliderField";
import LoadingSpinner from "Admin/src/components/LoadingSpinner";
import "../../../../assets/styles/visualizerAdmin.css";
import "../../../../assets/styles/action.css";

const SongList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // Quản lý anchorEl cho menu
  const [selectedSong, setSelectedSong] = useState(null); // Quản lý genre được chọn
  const [openRow, setOpenRow] = useState({});
  const [Songs, setSongs] = useState([]);
  const [songToDelete, setsongToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { selectedPlayer, setSelectedPlayer, isPlayerVisible, setIsPlayerVisible, isPlaying, setIsPlaying } = usePlayerContext();
  const location = useLocation();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [Genres, setGenres] = useState([]);
  const [limit, setLimit] = useState(5);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [minDuration, setMinDuration] = useState(60);
  const [maxDuration, setMaxDuration] = useState(300);
  const [minListen, setMinListen] = useState(0);
  const [maxListen, setMaxListen] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);
  const [copied, setCopied] = useState(false);


  const [expandedLyrics, setExpandedLyrics] = useState({});

  const SongData = async (page = 1, limit = 5, search = '', genres = [], minDuration = 0, maxDuration = 0, minListensCount = 0, maxListensCount = 0) => {
    try {
      const data = await getSongs(page, limit, search, genres, minDuration, maxDuration, minListensCount, maxListensCount);
      setSongs(data.songs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log("Không tìm thấy dữ liệu");
    }
  };

  const useDebouncedValue = (value, delay = 1000) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearchName = useDebouncedValue(searchName);
  const debouncedMinDuration = useDebouncedValue(minDuration);
  const debouncedMaxDuration = useDebouncedValue(maxDuration);
  const debouncedMinListen = useDebouncedValue(minListen);
  const debouncedMaxListen = useDebouncedValue(maxListen);

  useEffect(() => {
    SongData(currentPage, limit, debouncedSearchName, selectedGenres, debouncedMinDuration, debouncedMaxDuration, debouncedMinListen, debouncedMaxListen);

  }, [currentPage, limit, debouncedSearchName, selectedGenres, debouncedMinDuration, debouncedMaxDuration, debouncedMinListen, debouncedMaxListen]);


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
      songs.some(song =>
        song.genre.split(',').some(songGenre =>
          songGenre.trim().toLowerCase() === genre.name.trim().toLowerCase()
        )
      )
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

  const handleToggleLyrics = (songId) => {
    setExpandedLyrics((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const handleRowClick = (song, index) => {
    if (selectedPlayer?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedPlayer(song);
      setIsPlaying(true);
    }
    setIsPlayerVisible(true);
  };

  useEffect(() => {
    return () => {
      setIsPlayerVisible(false);
      setIsPlaying(false);
      setSelectedPlayer(null);
    };
  }, [location.pathname]);

  // // Hàm chuyển đến bài hát tiếp theo
  // const handleNext= () => {
  //   if (currentSongIndex < Songs.length - 1) {
  //     setCurrentSongIndex(currentSongIndex + 1);
  //     setSelectedPlayer(Songs[currentSongIndex + 1]);
  //     setIsPlaying(true);
  //   }
  // };

  // // Hàm quay lại bài hát trước
  // const handlePrev = () => {
  //   if (currentSongIndex > 0) {
  //     setCurrentSongIndex(currentSongIndex - 1);
  //     setSelectedPlayer(Songs[currentSongIndex - 1]);
  //     setIsPlaying(true);
  //   }
  // };


  const handleOpenMenu = (event, song) => {
    setAnchorEl(event.currentTarget);
    setSelectedSong(song);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSong(null);
  };


  const handleDeleteSong = async (id) => {
    setLoading(true);
    try {
      setSongs(prevSongs => prevSongs.filter(song => song.id !== id));
      setSelectedPlayer(null);
      setLoading(false);
      SongData(currentPage, limit, debouncedSearchName, selectedGenres, debouncedMinDuration, debouncedMaxDuration, debouncedMinListen, debouncedMaxListen);
    } catch (error) {
      console.log("Error deleting song", error);
      setLoading(false);
    }
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

  const getColorFromName = (name) => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[(name.charCodeAt(i % name.length) + i) % 14];
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
    setMinDuration(min);
    setMaxDuration(max);


  };

  const handleListenChange = (newValue) => {
    const [min, max] = newValue;
    setMinListen(min);
    setMaxListen(max);
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

  const handleCopy = (lyrics) => {
    const textarea = document.createElement('textarea');
    textarea.value = lyrics;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

  };

  return (
    <div className="p-4">
      <LoadingSpinner isLoading={loading} />
      <div className="flex justify-between mb-4">
        <div className="flex-grow">
          <TextField
            variant="outlined"
            value={searchName}
            onChange={handleSearchChange}
            className=" custom-textfield"
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
              className="border px-4 py-2 rounded-md flex items-center w-full md:w-auto bg-[#823ad5] text-white"
              onClick={() => setShowFilterMenu(prev => !prev)}
            >
              Filter <i className="fas fa-chevron-down ml-2"></i>
            </button>
            {showFilterMenu && (
              <div ref={filterMenuRef} className="absolute right-0 mt-2 w-full md:w-96 bg-white rounded-md shadow-lg z-10">
                <div className="px-4 py-2">
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Genres</h4>
                  <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="px-4 py-2 w-[370px]">
                  <RangeSliderField
                    label="Duration (Seconds)"
                    min={60}
                    max={300}
                    value={[minDuration, maxDuration]}
                    onChange={handleDurationChange}
                  />

                </div>
                <div className="px-4 py-2 w-[370px]">
                  <RangeSliderField
                    label="Listens"
                    min={0}
                    max={100000}
                    value={[minListen, maxListen]}
                    onChange={handleListenChange}
                  />
                </div>
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
                  <TableCell sx={{ color: "white", width: "10%" }}>#</TableCell>
                  <TableCell sx={{ color: "white", width: "27%" }}>Song</TableCell>
                  <TableCell sx={{ color: "white", width: "16%" }}>Artist</TableCell>
                  <TableCell sx={{ color: "white", width: "16%" }}>Album</TableCell>
                  <TableCell sx={{ color: "white", width: "16%" }}>Genre</TableCell>
                  <TableCell sx={{ color: "white", width: "10%" }}>Country</TableCell>
                  <TableCell sx={{ color: "white", width: "5%" }}>Action</TableCell>
                  <TableCell />
                </TableRow>

              </TableHead>
              <TableBody>
                {Songs.map((song, index) => (
                  <React.Fragment key={song.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >

                      <TableCell>
                      {(currentPage - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>
                            <img
                              src={`${song.image}`}
                              className="w-10 h-10 rounded-md"
                              onError={(e) => e.target.src = '/images/music.png'}
                            />
                          </span>
                          <div className="flex items-center">
                            <div className="flex items-center ml-2">
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                {song.title}
                              </span>
                              {song.is_premium === 1 && (
                                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-1 shrink-0">
                                  PREMIUM
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell sx={{ maxWidth: '145px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.artist}
                      </TableCell >
                      <TableCell sx={{ maxWidth: '145px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.album}
                      </TableCell>
                      <TableCell sx={{ maxWidth: '145px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {typeof song.genre === 'string' && song.genre.trim() !== '' ? (
                          <div className="flex flex-wrap">
                            {song.genre.split(',').slice(0, 2).map((genreName) => {
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
                      </TableCell >
                      <TableCell sx={{ maxWidth: '90px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.country}
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
                            <MdEdit style={{ marginRight: '8px', color: 'blue' }} />
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
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(song.id)}
                        >
                          {openRow[song.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
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
                                  {isPlaying && selectedPlayer?.id === song.id ? (
                                    <div className="visualizer flex items-center">
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                    </div>
                                  ) : (
                                    <MdPlayArrow size={24} />
                                  )}
                                </button>
                              </div>

                            </Typography>
                            <Typography variant="body1" className="pb-2 pt-2">Song: {song.title}</Typography>
                            <Typography variant="body1" className="pb-2 ">Artist: {song.artist}</Typography>
                            <Typography variant="body1" className="pb-2">Album: {song.album}</Typography>
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
                            <Typography
                              variant="body1"
                              className="pb-2"
                              style={{
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap',
                                maxHeight: '200px',
                                overflowY: 'auto',
                              }}
                            >
                              Lyrics:
                              <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                                <IconButton onClick={() => handleCopy(song.lyrics)}>
                                  <MdContentCopy size={20} />
                                </IconButton>
                              </Tooltip>
                              <br />
                              {expandedLyrics[song.id] ? (
                                song.lyrics
                              ) : (
                                <span>{song.lyrics.substring(0, 50)}...</span>
                              )}

                              {song.lyrics.length > 50 && (
                                <span
                                  onClick={() => handleToggleLyrics(song.id)}
                                  style={{
                                    color: '#1a73e8',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    textDecoration: 'underline',
                                  }}
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
              <Stack spacing={2} direction="row" alignItems="center">
                <Pagination
                  count={totalPages || 1}
                  page={currentPage}
                  onChange={handleChangePage}
                  color="primary"
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
          next={() => { /* Handle track end */ }}
          prevsong={() => { /* Handle track end */ }}
          onTrackEnd={() => {/* Handle track end */ }}
          audioUrl={selectedPlayer.file_song}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
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

