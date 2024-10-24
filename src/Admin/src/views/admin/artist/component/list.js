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
  Avatar,
  Backdrop,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { getArtists } from "../../../../../../services/artists";
import { handleDelete } from "../../../../components/notification";
import DeleteArtist from "./delete";

const ITEMS_PER_PAGE = 5;

const fetcher = (url, page, limit, searchTerm) =>
  getArtists(page, limit, searchTerm);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, error, isLoading, mutate } = useSWR(
    ["getArtists", page, ITEMS_PER_PAGE, debouncedSearchTerm],
    () => fetcher("getArtists", page, ITEMS_PER_PAGE, debouncedSearchTerm),
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
    setPage(1); // Reset page to 1 when searching
  };

  const handleOpenMenu = (event, artist) => {
    setAnchorEl(event.currentTarget);
    setSelectedArtist(artist);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedArtist(null);
  };

  const handleDeleteClick = (artist) => {
    setArtistToDelete(artist);
    setShowDeleteModal(true);
    handleCloseMenu();
  };

  const handleDeleteSuccess = () => {
    mutate(); // Cập nhật dữ liệu sau khi xóa thành công
    handleDelete("Artist deleted successfully");
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

  const handleEditArtist = (artist) => {
    navigate(`/admin/artist/edit/${artist.id}`); // Chuyển hướng đến trang edit với ID của nghệ sĩ
    handleCloseMenu(); // Đóng Menu sau khi chọn
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
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
      <div className="flex justify-between mb-4">
        <TextField
          label="Search Artist"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
          placeholder="Search by artist name..."
          disabled={isLoading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto hover:bg-blue-600"
          onClick={handleAddArtist}
        >
          ADD ARTIST +
        </button>
      </div>
      {data?.artists.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Avatar</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Monthly Listeners
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>CreateAt</TableCell>
                  <TableCell sx={{ color: "white" }}>Update At</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.artists.map((artist, index) => (
                  <>
                    <TableRow
                      key={artist.id}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>
                        {index + 1 + (page - 1) * ITEMS_PER_PAGE}
                      </TableCell>
                      <TableCell>{artist.name || "No name"}</TableCell>
                      <TableCell>
                        {artist.avatar ? (
                          <img
                            src={artist.avatar}
                            alt={artist.name || "Avatar"}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <Avatar>{getInitials(artist.name)}</Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        {artist.monthly_listeners.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                        {artist.createdAt
                          ? new Date(
                              artist.createdAt._seconds * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {artist.updatedAt
                          ? new Date(
                              artist.updatedAt._seconds * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, artist)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(artist.id)}
                        >
                          {openRow[artist.id] ? (
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
                          in={openRow[artist.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Additional Information for {artist.name}
                            </Typography>
                            <Typography variant="body1">
                              Bio: {artist.bio}
                            </Typography>
                            <Typography variant="body1">
                              Albums:{" "}
                              {artist.albumId && artist.albumId.length > 0
                                ? artist.albumId
                                    .map((album) => album.title || "No title")
                                    .join(", ")
                                : "No albums"}
                            </Typography>
                            <Typography variant="body1">
                              Songs:{" "}
                              {artist.songId
                                ? artist.songId
                                    .map((song) => song.title || "No title")
                                    .join(", ")
                                : "No songs"}
                            </Typography>
                            <Typography variant="body1">
                              Followers:{" "}
                              {artist.followerId ? artist.followerId.length : 0}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleEditArtist(selectedArtist)}>
              <EditIcon className="mr-2 text-yellow-500" /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteClick(selectedArtist)}>
              <DeleteIcon className="mr-2 text-red-500" /> Delete
            </MenuItem>
          </Menu>
          {showDeleteModal && (
            <DeleteArtist
              artistToDelete={artistToDelete}
              onClose={() => setShowDeleteModal(false)}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
          <div className="mt-4 flex justify-end items-center">
            <Stack spacing={2}>
              <Pagination
                count={data.totalPages || 1}
                page={page}
                onChange={handleChangePage}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        </>
      ) : (
        <Alert severity="warning">
          No artists found matching the search keyword.
        </Alert>
      )}
    </div>
  );
};

export default ArtistList;
