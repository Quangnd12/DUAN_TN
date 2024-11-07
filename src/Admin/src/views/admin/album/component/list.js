import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Menu, MenuItem, Pagination, Typography, Alert, Stack, Collapse, Box, Avatar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { MdEdit, MdDelete } from 'react-icons/md';
import { getAlbums, deleteAlbum } from "../../../../../../services/album";
import { getArtists } from "../../../../../../services/artist";
import { formatDate } from "Admin/src/components/formatDate";

const DeleteAlbum = ({ onClose, albumDelete, onDelete }) => {
  const handleDelete = async () => {
    try {
      await deleteAlbum(albumDelete.id);
      onDelete(albumDelete.id);
      onClose();
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Delete Album</h2>
        <p className="mb-4">Are you sure you want to delete "{albumDelete.title}"?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AlbumList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [openRow, setOpenRow] = useState({});
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState({});
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const location = useLocation();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAlbums = async (page) => {
    try {
      const data = await getAlbums(page);
      setAlbums(data);
      setTotalPages(Math.ceil(data.length / 10)); // Assuming 10 items per page
    } catch (error) {
      console.log("Could not fetch albums");
    }
  };
  const fetchArtists = async () => {
    try {
      const artists = await getArtists();
      const artistMap = artists.reduce((acc, artist) => {
        acc[artist.id] = artist.name;
        return acc;
      }, {});
      setArtists(artistMap);
    } catch (error) {
      console.log("Could not fetch artists");
    }
  };

  useEffect(() => {
    fetchAlbums(currentPage);
    fetchArtists();
  }, [currentPage]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenMenu = (event, album) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlbum(album);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAlbum(null);
  };

  const handleDeleteAlbum = (id) => {
    setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== id));
  };

  const handleOpenDeleteModal = (album) => {
    setAlbumToDelete(album);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setAlbumToDelete(null);
  };

  const toggleRow = (id) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getInitials = (title) => {
    if (!title) return "";
    const words = title.split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  const handleAddAlbum = () => {
    navigate("/admin/album/add");
  };

  const handleEditAlbum = (id) => {
    navigate(`/admin/album/edit/${id}`);
  };

  return (
    <div className="p-4">
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
            onClick={handleAddAlbum}
          >
            + Add Album
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

      {albums?.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell />
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Album</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist</TableCell>
                  <TableCell sx={{ color: "white" }}>Release Date</TableCell>
                  <TableCell sx={{ width: "70px", color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {albums.map((album, index) => (
                  <React.Fragment key={album.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(album.id)}
                        >
                          {openRow[album.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>
                            {album.image ? (
                              <img
                                src={`${album.image}`}
                                alt={album.title || "Album Cover"}
                                className="w-10 h-10 rounded-md"
                              />
                            ) : (
                              <Avatar>{getInitials(album.title)}</Avatar>
                            )}
                          </span>
                          <span className="ml-2">
                            {album.title || "Untitled Album"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{artists[album.artistID] || "Unknown"}</TableCell>
                      <TableCell>{formatDate(album.releaseDate)}</TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleOpenMenu(event, album)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedAlbum?.id === album.id}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => {
                            handleCloseMenu();
                            handleEditAlbum(album.id);
                          }}>
                            <MdEdit style={{ marginRight: '8px', color: 'blue' }} />
                            <span style={{ color: 'blue' }}>Edit</span>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleCloseMenu();
                              handleOpenDeleteModal(album);
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
                        <Collapse in={openRow[album.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                              Album Details
                            </Typography>
                            <Typography variant="body1" className="pb-2">
                              Release Date: {formatDate(album.releaseDate)}
                            </Typography>
                            {/* Add more album details here as needed */}
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
                count={totalPages || 1}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        </>
      ) : (
        <Alert severity="warning">No albums found matching the search criteria.</Alert>
      )}

      {openDeleteModal && (
        <DeleteAlbum
          onClose={handleCloseDeleteModal}
          albumDelete={albumToDelete}
          onDelete={handleDeleteAlbum}
        />
      )}
    </div>
  );
};

export default AlbumList;