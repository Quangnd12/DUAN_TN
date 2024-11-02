import React, { useState, useEffect } from "react";
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
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

const ITEMS_PER_PAGE = 5;

const fetcher = (url, page, limit, searchTerm) => {
  // Hàm giả để lấy dữ liệu artist. Có thể điều chỉnh lại sau này.
  return Promise.resolve({
    artists: [
      {
        id: 1,
        name: "Sơn Tùng",
        avatar: "https://storage.googleapis.com/be-musicheals.appspot.com/artists/images/moon_knight_e9ea4f9f.png",
        role: "Singer",
        biography: "khang123",
        createdAt: "2024-11-02T08:15:14.000Z",
      },
      // Thêm dữ liệu artist ở đây nếu cần
    ],
    totalPages: 1,
  });
};

const ArtistList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [openRow, setOpenRow] = useState({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, error, isLoading } = useSWR(
    ["getAllArtists", page, ITEMS_PER_PAGE, debouncedSearchTerm],
    () => fetcher("getAllArtists", page, ITEMS_PER_PAGE, debouncedSearchTerm),
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

  const handleOpenMenu = (event, artistItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedArtist(artistItem);
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
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
      </div>
      {data?.artists.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell />
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Avatar</TableCell>
                  <TableCell sx={{ color: "white" }}>Artist Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Role</TableCell>
                  <TableCell sx={{ color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.artists.map((artistItem) => (
                  <>
                    <TableRow
                      key={artistItem.id}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
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
                      <TableCell>{artistItem.id}</TableCell>
                      <TableCell>
                        <Avatar src={artistItem.avatar} alt={artistItem.name} />
                      </TableCell>
                      <TableCell>{artistItem.name || "No name"}</TableCell>
                      <TableCell>
                        <Chip label={artistItem.role} color="primary" />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, artistItem)}
                        >
                          <MoreVertIcon />
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
                            <Typography variant="h6" gutterBottom component="div">
                              Biography: {artistItem.biography}
                              <br />
                              Created At: {new Date(artistItem.createdAt).toLocaleDateString()}
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
        <Alert severity="warning">
          No artists found matching the search keyword.
        </Alert>
      )}
    </div>
  );
};

export default ArtistList;
