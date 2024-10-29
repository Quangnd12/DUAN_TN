import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useSWR from "swr";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Menu, MenuItem, CircularProgress, Pagination, Typography, Alert, Stack, Collapse, Box, Avatar, Backdrop,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { MdEdit, MdDelete, MdPlayArrow } from 'react-icons/md';
import { getSongs } from "../../../../../../services/songs";

import DeleteSong from "./delete";
import { formatDate, formatDuration } from "Admin/src/components/formatDate";
import PlayerControls from "../../../../components/audio/PlayerControls";
import { usePlayerContext } from "Admin/src/components/audio/playerContext";

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


  const handleRowClick = (song, index) => {
    setSelectedPlayer(song);
    setIsPlayerVisible(true);
  };

  useEffect(() => {
    // Khi route thay đổi, ẩn thanh phát nhạc
    return () => {
      setIsPlayerVisible(false);
    };
  }, [location.pathname, setIsPlayerVisible]);

  useEffect(() => {
    SongData();
  }, []);

  const SongData = async () => {
    try {
      const data = await getSongs();
      setSongs(data);
    } catch (error) {
      console.log("Không tìm thấy dữ liệu");
    }
  };

  const playTrack = (track) => {
    if (selectedPlayer?.id === track.id) {
      // Nếu đang phát bài hát này, chỉ cần đổi trạng thái phát tạm dừng
      setIsPlaying(!isPlaying);
    } else {
      // Nếu chọn một bài hát khác, thiết lập bài hát mới
      setSelectedPlayer(track);
      setIsPlaying(true); // Bắt đầu phát bài hát
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setSelectedPlayer(null);
    }
  }, [isPlaying]);

  const handleOpenMenu = (event, song) => {
    setAnchorEl(event.currentTarget);
    setSelectedSong(song); // Cập nhật genre được chọn
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSong(null); // Đóng menu khi không chọn
  };


  const handleDeleteSong = (songId) => {
    setSongs(prevGenres => prevGenres.filter(song => song.songId !== songId));
  };

  const handleOpenDeleteModal = (song) => {
    setsongToDelete(song);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setsongToDelete(null);
  };

  const toggleRow = (songId) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [songId]: !prevState[songId],
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
                  <TableCell sx={{ color: "white" }}>category</TableCell>
                  <TableCell sx={{ color: "white" }}>Album</TableCell>
                  <TableCell sx={{ width: "70px", color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Songs.map((song, index) => (
                  <React.Fragment key={song.songId}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(song.songId)}
                        >
                          {openRow[song.songId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
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
                        {song.artistIds.map(artist => artist.name).join(', ')}
                      </TableCell>
                      <TableCell>{song.genreIds?.name}</TableCell>
                      <TableCell>
                        {song.albumIds.map(album => album.name).join(', ')}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleOpenMenu(event, song)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedSong?.songId === song.songId}
                          onClose={handleCloseMenu}

                        >
                          <MenuItem onClick={() => {
                            handleCloseMenu();
                            handleEditsong(song.songId);
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
                        <Collapse in={openRow[song.songId]} timeout="auto" unmountOnExit>
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
                            <Typography variant="body1" className="pb-2">Subgenres: </Typography>
                            {Array.isArray(song.genreIds?.subgenres) ? (
                              <div className="flex flex-wrap">
                                {song.genreIds.subgenres.map((subgenre) => (
                                  <Typography
                                    key={subgenre.id || subgenre.name}
                                    variant="body2"
                                    component="div"
                                    style={{
                                      backgroundColor: getColorFromName(subgenre.name),
                                      color: '#fff',
                                      padding: '4px 12px',
                                      marginRight: '8px',
                                      marginBottom: '4px',
                                      borderRadius: '16px',
                                    }}
                                  >
                                    {subgenre.name}
                                  </Typography>
                                ))}
                              </div>
                            ) : (
                              <Typography variant="body2" component="div">
                                No subgenres available
                              </Typography>
                            )}
                            <Typography variant="body1" className="pb-2 pt-2">Duration: {formatDuration(song.duration)}</Typography>
                            <Typography variant="body1" className="pb-2 ">release date: {formatDate(song.releasedate)}</Typography>
                            <Typography variant="body1" className="pb-2">Play count: {song.playcountId}</Typography>
                            <Typography variant="body1" className="pb-2">lyrics: {song.lyrics}</Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-4 flex justify-end items-center">
            <Stack spacing={2}>
              <Pagination
                // count={data.totalPages || 1} // Tính số trang từ data
                // page={page}
                // onChange={handleChangePage}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        </>
      ) : (
        <Alert severity="warning">No song found matching the search keyword.</Alert>
      )}
      {selectedPlayer && (
        <PlayerControls
          title={selectedPlayer.title}
          artist={selectedPlayer.artistIds.map(artist => artist.name).join(', ')}
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

