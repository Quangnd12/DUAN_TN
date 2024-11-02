import React, { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Pagination,
  Stack,
  Backdrop,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  TextField,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const ITEMS_PER_PAGE = 5;

const fetcher = (url, page, limit) => {
  return Promise.resolve({
    albums: [
      {
        id: 1,
        title: "khang123",
        image: "https://storage.googleapis.com/be-musicheals.appspot.com/albums/images/spider_man_fe91fbde.png",
        artistID: "Sơn Tùng MTP",
        releaseDate: "2024-11-01T17:00:00.000Z",
      },
      // Thêm dữ liệu album ở đây nếu cần
    ],
    totalPages: 1,
  });
};

const AlbumList = () => {
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading } = useSWR(
    ["getAllAlbums", page, ITEMS_PER_PAGE],
    () => fetcher("getAllAlbums", page, ITEMS_PER_PAGE),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenMenu = (event, album) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlbum(album);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAlbum(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAlbums = data?.albums.filter((album) =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <TextField
        label="Search Albums"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {filteredAlbums?.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Album Title</TableCell>
                  <TableCell sx={{ color: "white" }}>Album Image</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist</TableCell>
                  <TableCell sx={{ color: "white" }}>Release Date</TableCell>
                  <TableCell sx={{ color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlbums.map((album) => (
                  <TableRow
                    key={album.id}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <TableCell>{album.id}</TableCell>
                    <TableCell>{album.title}</TableCell>
                    <TableCell>
                      <Avatar src={album.image} alt={album.title} />
                    </TableCell>
                    <TableCell>{album.artistID}</TableCell>
                    <TableCell>{new Date(album.releaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleOpenMenu(event, album)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
          </Menu>
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
        <Typography>No albums found.</Typography>
      )}
    </div>
  );
};

export default AlbumList;
