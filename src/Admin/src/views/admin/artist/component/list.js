import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
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
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { MdEdit, MdDelete } from "react-icons/md";
import { fetcher } from "../../../../../../services/artist";
import DeleteArtist from "./delete";
import LoadingSpinner from "Admin/src/components/LoadingSpinner";

const ArtistList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [openRow, setOpenRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch artists data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetcher(page, itemsPerPage, debouncedSearchTerm);
        setArtists(response.artists);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchTerm, page, itemsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page when items per page changes
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search term changes
  };

  const handleOpenMenu = (event, artist) => {
    setAnchorEl(event.currentTarget);
    setSelectedArtist(artist);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedArtist(null);
  };

  const toggleRow = (artistId) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [artistId]: !prevState[artistId],
    }));
  };

  const handleAddArtist = () => navigate("/admin/artist/add");

  const handleEditArtist = (artistId) => {
    navigate(`/admin/artist/edit/${artistId}`);
    handleCloseMenu();
  };

  const handleDeleteClick = (artist) => {
    setArtistToDelete(artist);
    setShowDeleteModal(true);
    handleCloseMenu();
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    // Refresh the current page after deletion
    const fetchData = async () => {
      try {
        const response = await fetcher(page, itemsPerPage, debouncedSearchTerm);
        setArtists(response.artists);
        setTotalPages(response.totalPages);
        
        // If current page is empty and it's not the first page, go to previous page
        if (response.artists.length === 0 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  };

  if (error) {
    return (
      <Typography color="error">
        Error: {error.message || "Failed to fetch artists"}
      </Typography>
    );
  }

  return (
    <div className="p-4">
      <LoadingSpinner isLoading={loading} />

      <div className="flex justify-between mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
          placeholder="Search..."
          disabled={loading}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
            },
          }}
        />
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
            onClick={handleAddArtist}
          >
            + Add Artist
          </button>
        </div>
      </div>

      {artists.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>                
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Avatar</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Role</TableCell>
                  <TableCell sx={{ color: "white",width: "50px" }}>Action</TableCell> 
                  <TableCell sx={{ color: "white", width: "50px", textAlign: "center" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {artists.map((artistItem, index) => (
                  <React.Fragment key={artistItem.id}>
                    <TableRow
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                    
                      <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Avatar src={artistItem.avatar} alt={artistItem.name} />
                      </TableCell>
                      <TableCell>{artistItem.name || "No name"}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            artistItem.role === 1
                              ? "Artist"
                              : artistItem.role === 2
                              ? "Rapper"
                              : "Unknown"
                          }
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, artistItem)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(artistItem.id)}
                        >
                          {openRow[artistItem.id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openRow[artistItem.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Biography: {artistItem.biography}
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

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedArtist !== null}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => handleEditArtist(selectedArtist.id)}
              sx={{ color: "blue" }}
            >
              <MdEdit className="mr-1" /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => handleDeleteClick(selectedArtist)}
              sx={{ color: "red" }}
            >
              <MdDelete className="mr-1" /> Delete
            </MenuItem>
          </Menu>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="limit">Show items:</label>
              <select
                id="limit"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded p-1"
              >
                <option value={5}>Show 5</option>
                <option value={10}>Show 10</option>
                <option value={15}>Show 15</option>
              </select>
            </div>

            <Stack spacing={2} direction="row" alignItems="center">
              {totalPages > 0 && (
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  shape="rounded"
                />
              )}
            </Stack>
          </div>
        </>
      ) : (
        <Alert severity="info">No artists found</Alert>
      )}

      {showDeleteModal && (
        <DeleteArtist
          artistToDelete={artistToDelete}
          onClose={() => setShowDeleteModal(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default ArtistList;