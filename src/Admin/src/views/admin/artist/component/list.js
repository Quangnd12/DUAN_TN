import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
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
  CircularProgress,
  Pagination,
  Typography,
  Alert,
  Stack,
  Collapse,
  Box,
  Backdrop,
  Chip,
  Avatar,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { MdEdit, MdDelete } from "react-icons/md";
import { fetcher } from "../../../../../../services/artist"; 
import DeleteArtist from "./delete";

const ITEMS_PER_PAGE = 5;

const ArtistList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [openRow, setOpenRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch data using SWR
  const { data, error, isLoading, mutate } = useSWR(
    ["getArtists", page, ITEMS_PER_PAGE, debouncedSearchTerm],
    () => fetcher(page, ITEMS_PER_PAGE, debouncedSearchTerm),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
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

  const handleAddArtist = () => {
    navigate("/admin/artist/add");
  };

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
    mutate(); // Refreshes the list after deletion
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Top section with search and action buttons */}
      <div className="flex justify-between mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
          placeholder="Search..."
          disabled={isLoading}
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

      {data?.artists.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell />
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Avatar</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Role</TableCell>
                  <TableCell sx={{ color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.artists.map((artistItem) => (
                  <React.Fragment key={artistItem.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(artistItem.id)}
                        >
                          {openRow[artistItem.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{artistItem.id}</TableCell>
                      <TableCell>
                        <Avatar src={artistItem.avatar} alt={artistItem.name} />
                      </TableCell>
                      <TableCell>{artistItem.name || "No name"}</TableCell>
                      <TableCell>
                        <Chip
                          label={artistItem.role === 1 ? "Artist" : artistItem.role === 2 ? "Rapper" : "Unknown"}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleOpenMenu(event, artistItem)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openRow[artistItem.id]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
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

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedArtist !== null} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleEditArtist(selectedArtist.id)} sx={{ color: "blue" }}>
              <MdEdit className="mr-1" /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteClick(selectedArtist)} sx={{ color: "red" }}>
              <MdDelete className="mr-1" /> Delete
            </MenuItem>
          </Menu>

          <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Pagination count={data?.totalPages} page={page} onChange={handleChangePage} color="primary" shape="rounded" />
          </Stack>
        </>
      ) : (
        <Alert severity="info">No artists found.</Alert>
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
