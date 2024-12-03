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
  MenuItem,
  CircularProgress,
  Pagination,
  Avatar,
  Backdrop,
  Badge,
  FormControl,
  Select,
  Stack,
} from "@mui/material";
import { useGetUsersQuery } from "../../../../../../redux/slice/apiSlice";

const UserList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");


  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1);
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

      <div className="flex flex-wrap gap-4 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          className="w-64"
          placeholder="Search by username or email..."
          disabled={isLoading}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "40px",
            },
          }}
        />


      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#18181b" }}>
              <TableCell width="5%" sx={{ color: "white" }}>
                #
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                Avatar
              </TableCell>
              <TableCell width="15%" sx={{ color: "white" }}>
                Username
              </TableCell>
              <TableCell width="20%" sx={{ color: "white" }}>
                Email
              </TableCell>
              <TableCell
                width="10%"
                sx={{ color: "white", paddingLeft: "24px" }}
              >
                Role
              </TableCell>
              <TableCell width="15%" sx={{ color: "white" }}>
                Birthday
              </TableCell>
              <TableCell width="15%" sx={{ color: "white" }}>
                Created At
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.map((user, index) => (
              <React.Fragment key={user.id}>
                <TableRow>
                  <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Avatar src={user.avatar}>
                      {getInitials(user.username)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.username || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell sx={{ paddingLeft: "24px" }}>
                    <Badge
                      badgeContent={user.role}
                      color={user.role === "admin" ? "primary" : "success"}
                      sx={{
                        "& .MuiBadge-badge": {
                          minWidth: "60px",
                          height: "24px",
                          margin: "0 -20px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.birthday)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="limit">Show items:</label>
          <select id="limit"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            disabled={isLoading}
            className="border border-gray-300 rounded p-1">
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={15}>Show 15</option>
          </select>
        </div>
        {data?.pagination && (
          <div className="flex justify-end items-center mt-4">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(data.pagination.total / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                disabled={isLoading}
                shape="rounded"
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
