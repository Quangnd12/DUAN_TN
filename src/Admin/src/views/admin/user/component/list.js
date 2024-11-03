import React, { useState, useEffect } from "react";
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
  Avatar,
  Backdrop,
  Chip,
  Box,
  Collapse,
  FormControl,
  Select,
  Stack
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useGetUsersQuery } from "../../../../../../redux/slice/apiSlice";

const ITEMS_PER_PAGE = 5;

const UserList = () => {
  // State for pagination and sorting
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  
  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRow, setOpenRow] = useState({});

  // RTK Query hook with pagination params
  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm,
    sort,
    order,
  });

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handlers
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Search and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
          placeholder="Search by username or email..."
          disabled={isLoading}
        />

        <FormControl variant="outlined" className="w-48">
          <Select
            value={sort}
            onChange={handleSortChange}
            disabled={isLoading}
            displayEmpty
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="username">Username</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="w-48">
          <Select
            value={order}
            onChange={handleOrderChange}
            disabled={isLoading}
            displayEmpty
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Avatar</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.map((user) => (
              <React.Fragment key={user.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(user.id)}
                    >
                      {openRow[user.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Avatar src={user.avatar}>{getInitials(user.username)}</Avatar>
                  </TableCell>
                  <TableCell>{user.username || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === "admin" ? "primary" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleOpenMenu(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRow[user.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          User Details
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">Birthday</TableCell>
                              <TableCell>{formatDate(user.birthday)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row">Created At</TableCell>
                              <TableCell>{formatDate(user.createdAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row">Updated At</TableCell>
                              <TableCell>{formatDate(user.updatedAt)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-end items-center mt-4">
          <Stack spacing={2}>
          <Pagination
            count={Math.ceil(data.pagination.total / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            disabled={isLoading}
            shape="rounded"
          />
           </Stack>
        </div>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default UserList;