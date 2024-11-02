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
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

const ITEMS_PER_PAGE = 5;

const fetcher = (url, page, limit, searchTerm) => {
  // Hàm giả để lấy dữ liệu sự kiện. Có thể điều chỉnh lại sau này.
  return Promise.resolve({
    events: [
      {
        id: 1,
        name: "Music Concert",
        venue: "City Hall",
        ticketLink: "https://example.com/tickets/1",
        artistId: "A1",
        category: "Music",
        date: "2024-10-20",
      },
      {
        id: 2,
        name: "Art Exhibition",
        venue: "Art Gallery",
        ticketLink: "https://example.com/tickets/2",
        artistId: "A2",
        category: "Art",
        date: "2024-10-25",
      },
      // Thêm dữ liệu sự kiện ở đây nếu cần
    ],
    totalPages: 1,
  });
};

const EventList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    ["getAllEvents", page, ITEMS_PER_PAGE, debouncedSearchTerm],
    () => fetcher("getAllEvents", page, ITEMS_PER_PAGE, debouncedSearchTerm),
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

  const handleOpenMenu = (event, eventItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventItem);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const toggleRow = (eventId) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [eventId]: !prevState[eventId],
    }));
  };

  if (error) {
    return (
      <Typography color="error">
        Error: {error.message || "Failed to fetch events"}
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
      {data?.events.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#18181b" }}>
                  <TableCell />
                  <TableCell sx={{ color: "white" }}>Event ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Event Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Event Venue</TableCell>
                 
                
                  <TableCell sx={{ color: "white" }}>Event Category</TableCell>
               
                  <TableCell sx={{ color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.events.map((eventItem, index) => (
                  <>
                    <TableRow
                      key={eventItem.id}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }} // Hiệu ứng hover
                    >
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(eventItem.id)}
                        >
                          {openRow[eventItem.id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{eventItem.id}</TableCell>
                      <TableCell>{eventItem.name || "No name"}</TableCell>
                      <TableCell>{eventItem.venue || "No venue"}</TableCell>
                   
                      <TableCell>
                        <Chip 
                          label={eventItem.category}
                          color="primary"
                        />
                      </TableCell>
                    
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleOpenMenu(event, eventItem)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={9}
                      >
                        <Collapse
                          in={openRow[eventItem.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Date event: {eventItem.date} 
                              <br></br>
                              Artist name: {eventItem.artistId}
                              <br></br>
                              Link event: {eventItem.ticketLink}
                            </Typography>
                            {/* Thêm thông tin chi tiết của sự kiện nếu cần */}
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
          No events found matching the search keyword.
        </Alert>
      )}
    </div>
  );
};

export default EventList;
