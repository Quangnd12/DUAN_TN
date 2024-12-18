import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Typography,
  Alert,
  Stack,
  Collapse,
  Box,
  Avatar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { MdEdit, MdDelete } from "react-icons/md";
import { getAlbums, getAlbumById } from "../../../../../../services/album";
import DeleteAlbum from "./delete";
import { formatDate } from "Admin/src/components/formatDate";

const AlbumList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [openRow, setOpenRow] = useState({});
  const [albumDetails, setAlbumDetails] = useState({});
  const [albums, setAlbums] = useState([]);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTitle, setSearchTitle] = useState("");
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState({});

  const fetchAlbumData = useCallback(
    async (page, limit, searchTitle) => {
      setIsLoading(true);
      try {
        const data = await getAlbums(page, limit, [], searchTitle);
        if (data) {
          const albumsWithArtists = data.albums.map((album) => ({
            ...album,
            artist: Array.isArray(album.artistNames)
              ? album.artistNames
              : [album.artistNames],
          }));
          setAlbums(albumsWithArtists);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        setAlbums([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchAlbumDetails = useCallback(async (albumId) => {
    setIsDetailsLoading(prev => ({ ...prev, [albumId]: true }));
    try {
      const details = await getAlbumById(albumId);
      setAlbumDetails(prev => ({ ...prev, [albumId]: details }));
    } catch (error) {
      console.error(`Error fetching album ${albumId} details:`, error);
    } finally {
      setIsDetailsLoading(prev => ({ ...prev, [albumId]: false }));
    }
  }, []);

  useEffect(() => {
    fetchAlbumData(currentPage, limit, searchTitle);
  }, [fetchAlbumData, currentPage, limit, searchTitle]);

  const toggleRow = (id) => {
    setOpenRow((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id]
      };

      if (newState[id] && !albumDetails[id]) {
        fetchAlbumDetails(id);
      }

      return newState;
    });
  };

  const handleOpenMenu = (event, album) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlbum(album);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAlbum(null);
  };

  const handleEditAlbum = (id) => {
    navigate(`/admin/album/edit/${id}`);
    handleCloseMenu();
  };

  const handleOpenDeleteModal = (album) => {
    setAlbumToDelete(album);
    setOpenDeleteModal(true);
    handleCloseMenu();
  };

  const handleCloseDeleteModal = () => {
    setAlbumToDelete(null);
    setOpenDeleteModal(false);
  };

  const handleAddAlbum = () => {
    navigate("/admin/album/add");
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const getInitials = (title) => {
    if (!title) return "";
    const words = title.split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  const getColorFromName = (name) => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[(name.charCodeAt(i % name.length) + i) % 14];
    }
    return color;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div className="flex-grow">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              debounce(() => {
                setCurrentPage(1);
                fetchAlbumData(1, limit, e.target.value);
              }, 500)();
            }}
            className="w-64"
            placeholder="Search by album name..."
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            onClick={handleAddAlbum}
          >
            + Add Album
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : albums.length === 0 ? (
        <Alert severity="info">No albums found matching the search criteria.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>          
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Album</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist</TableCell>
                  <TableCell sx={{ color: "white" }}>Release Date</TableCell>
                  <TableCell sx={{ width: "70px", color: "white" }}>Action</TableCell>
                  <TableCell sx={{ color: "white", width: "50px", textAlign: "center" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {albums.map((album, index) => (
                  <React.Fragment key={album.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>                 
                      <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {album.image ? (
                            <img
                              src={album.image}
                              alt={album.title}
                              className="w-10 h-10 rounded-md"
                            />
                          ) : (
                            <Avatar>{getInitials(album.title)}</Avatar>
                          )}
                          <span className="ml-2">{album.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(album.artist) ? (
                            album.artist.map((artist, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded-full text-sm"
                                style={{
                                  backgroundColor: getColorFromName(artist),
                                  color: "#fff",
                                }}
                              >
                                {artist}
                              </span>
                            ))
                          ) : (
                            <span>{album.artist}</span>
                          )}
                        </div>
                      </TableCell>
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
                          <MenuItem onClick={() => handleEditAlbum(album.id)}>
                            <MdEdit style={{ marginRight: "8px", color: "blue" }} />
                            <span style={{ color: "blue" }}>Edit</span>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(album.id)}
                        >
                          {openRow[album.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={openRow[album.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            {isDetailsLoading[album.id] ? (
                              <Typography>Loading album details...</Typography>
                            ) : albumDetails[album.id] ? (
                              <>
                                <Typography variant="h6" gutterBottom component="div">
                                  Album Songs
                                </Typography>
                                {albumDetails[album.id].songs.length > 0 ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Artists</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {albumDetails[album.id].songs.map((song) => (
                                        <TableRow key={song.id}>
                                          <TableCell>{song.title}</TableCell>
                                          <TableCell>
                                            {(() => {
                                              const minutes = Math.floor(song.duration / 60);
                                              const seconds = Math.floor(song.duration % 60);
                                              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                            })()}
                                          </TableCell>
                                          <TableCell>
                                            {song.artistNames.join(", ")}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Typography>No songs in this album</Typography>
                                )}
                              </>
                            ) : null}
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
              <select
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded p-1"
              >
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
      )}

      {openDeleteModal && (
        <DeleteAlbum
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          album={albumToDelete}
          onDelete={() => {
            fetchAlbumData(currentPage, limit, searchTitle);
          }}
        />
      )}
    </div>
  );
};

export default AlbumList;
