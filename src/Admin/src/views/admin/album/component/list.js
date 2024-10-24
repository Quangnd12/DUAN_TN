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
  Button,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { getAlbums } from "../../../../../../services/albums";
import { handleDelete } from "../../../../components/notification";
import DeleteAlbum from "./delete";

const ITEMS_PER_PAGE = 5;

const fetcher = (url, page, limit, searchTerm) =>
  getAlbums(page, limit, searchTerm); // Sử dụng getAlbums để lấy dữ liệu album

const AlbumList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [openRow, setOpenRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, error, isLoading, mutate } = useSWR(
    ["getAlbums", page, ITEMS_PER_PAGE, debouncedSearchTerm],
    () => fetcher("getAlbums", page, ITEMS_PER_PAGE, debouncedSearchTerm),
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
    setPage(1); // Reset trang về 1 khi tìm kiếm
  };

  const handleOpenMenu = (event, album) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlbum(album);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAlbum(null);
  };

  const handleDeleteClick = (album) => {
    setAlbumToDelete(album);
    setShowDeleteModal(true);
    handleCloseMenu();
  };

  const handleDeleteSuccess = () => {
    mutate(); // Cập nhật dữ liệu sau khi xóa thành công
    handleDelete("Artist deleted successfully");
  };

  const toggleRow = (albumId) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [albumId]: !prevState[albumId],
    }));
  };

  const handleAddAlbum = () => {
    navigate("/admin/album/add");
  };

  const handleEditAlbum = (album) => {
    navigate(`/admin/album/edit/${album.id}`);
  };

  const getInitials = (title) => {
    if (!title) return "";
    const titles = title.split(" ");
    return titles.length > 1 ? titles[0][0] + titles[1][0] : titles[0][0];
  };

  if (error) {
    return (
      <Typography color="error">
        Error: {error.message || "Failed to fetch albums"}
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
          label="Search Albums"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
          placeholder="Search by album title..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleAddAlbum}
          endIcon={<AddIcon />}
        >
          Add Album
        </Button>
      </div>
      {data?.albums.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell sx={{ color: "white" }}>#</TableCell>
                  <TableCell sx={{ color: "white" }}>Album Title</TableCell>
                  <TableCell sx={{ color: "white" }}>Cover</TableCell>
                  <TableCell sx={{ color: "white" }}>Release Date</TableCell>
                  <TableCell sx={{ color: "white" }}>CreateAt</TableCell>
                  <TableCell sx={{ color: "white" }}>Update At</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.albums.map((album, index) => (
                  <>
                    <TableRow
                      key={album.id}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>
                        {index + 1 + (page - 1) * ITEMS_PER_PAGE}
                      </TableCell>
                      <TableCell>{album.title || "No title"}</TableCell>
                      <TableCell>
                        {album.image ? (
                          <img
                            src={album.image}
                            alt={album.title || "Cover"}
                            className="w-10 h-10 rounded"
                          />
                        ) : (
                          <Avatar>{getInitials(album.title)}</Avatar>
                        )}
                      </TableCell>
                      <TableCell>
                        {album.releaseDate
                          ? new Date(album.releaseDate._seconds * 1000).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {album.createdAt
                          ? new Date(
                              album.createdAt._seconds * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {album.updatedAt
                          ? new Date(
                              album.updatedAt._seconds * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, album)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(album.id)}
                        >
                          {openRow[album.id] ? (
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
                          in={openRow[album.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Additional Information for {album.title}
                            </Typography>
                            <Typography variant="body1">
                              Description: {album.describe || "No description"}
                            </Typography>
                            <Typography variant="body1">
                              Songs:
                              {album.songId
                                ? album.songId
                                    .map((song) => song.title)
                                    .join(", ")
                                : "No songs"}
                            </Typography>
                            <Typography variant="body1">
                              Artist:{" "}
                              {album.artistId
                                ? album.artistId
                                    .map((artist) => artist.name)
                                    .join(", ")
                                : "Unknown artist"}
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
            <MenuItem onClick={() => handleEditAlbum(selectedAlbum)}>
              <EditIcon className="mr-2 text-yellow-500" /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteClick(selectedAlbum)}>
              <DeleteIcon className="mr-2 text-red-500" /> Delete
            </MenuItem>
          </Menu>
          {showDeleteModal && (
            <DeleteAlbum
              albumToDelete={albumToDelete}
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
          No albums found matching the search keyword.
        </Alert>
      )}
    </div>
  );
};

export default AlbumList;
