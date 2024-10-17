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
  Avatar,
  Backdrop,
  Chip
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { getAllUsers } from "../../../../../../services/Api_url";

const ITEMS_PER_PAGE = 5;

const fetcher = (url, page, limit, searchTerm) =>
  getAllUsers(page, limit, searchTerm);

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRow, setOpenRow] = useState({}); // State để quản lý mở/đóng hàng

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, error, isLoading } = useSWR(
    ["getAllUsers", page, ITEMS_PER_PAGE, debouncedSearchTerm],
    () => fetcher("getAllUsers", page, ITEMS_PER_PAGE, debouncedSearchTerm),
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

  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const toggleRow = (userId) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const getInitials = (username) => {
    if (!username) return "";
    const names = username.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
  };

  

 

  if (error) {
    return (
      <Typography color="error">
        Error: {error.message || "Failed to fetch users"}
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
          disabled={isLoading} // Disable khi đang tải
        />

      </div>
      {data?.users.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  {" "}
                  <TableCell />
                  <TableCell sx={{color: "white"}}>#</TableCell>
                  <TableCell sx={{color: "white"}}>Username</TableCell>
                  <TableCell sx={{color: "white"}}>Avatar</TableCell>
                  <TableCell sx={{color: "white"}}>Email</TableCell>
                  <TableCell sx={{color: "white"}}>Role</TableCell>
                  <TableCell sx={{color: "white"}}>Created At</TableCell>
                  <TableCell sx={{color: "white"}}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.users.map((user, index) => (
                  <>
                    <TableRow
                      key={user.id}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }} // Hiệu ứng hover
                    >
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(user.id)}
                        >
                          {openRow[user.id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {index + 1 + (page - 1) * ITEMS_PER_PAGE}
                      </TableCell>
                      <TableCell>{user.username || "No username"}</TableCell>
                      <TableCell>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username || "Avatar"}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <Avatar>{getInitials(user.username)}</Avatar> // Hiển thị Letter Avatar
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role}
                          color={user.role === 'admin' ? 'secondary' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(
                          user.createdAt._seconds * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, user)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={8}
                      >
                        <Collapse
                          in={openRow[user.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Additional Information for {user.username}
                            </Typography>
                            <Typography variant="body1">
                              Follows: {user.followsId}
                            </Typography>
                            <Typography variant="body1">
                              Playlists: {user.playlistsId}
                            </Typography>
                            {/* Thêm thông tin chi tiết của người dùng */}
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
            <MenuItem onClick={handleCloseMenu}>Block</MenuItem>
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
          No users found matching the search keyword.
        </Alert>
      )}
    </div>
  );
};

export default UserList;
