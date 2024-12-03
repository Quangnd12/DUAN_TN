import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Collapse,
  IconButton,
  Menu,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  useGetAllEventsQuery,
  determineEventStatus,
} from "../../../../../../redux/slice/eventSlice";
import DeleteEventModal from "../component/delete";

const getStatusBadgeProps = (status) => {
  switch (status) {
    case "upcoming":
      return { color: "success", label: "Upcoming" };
    case "ongoing":
      return { color: "warning", label: "Ongoing" };
    case "completed":
      return { color: "info", label: "Completed" };
    default:
      return { color: "default", label: status };
  }
};

const CollapsibleRow = ({
  event,
  page,
  itemsPerPage,
  index,
  formatDate,
  // onEdit,
  onDelete,
  onDetail,
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const statusBadgeProps = getStatusBadgeProps(event.status);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
        <TableCell>
          <div className="flex items-center">
            <span>
              <Avatar
                src={`${event.coverUrl}`}
                variant="rounded"
                onError={(e) => (e.target.src = "/images/music.png")}
              />
            </span>
            <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis w-[250px]">
              {event.name}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            badgeContent={event.eventCategory}
            color="secondary"
            sx={{
              "& .MuiBadge-badge": {
                minWidth: "60px",
                height: "24px",
                margin: "0 -20px",
              },
            }}
          />
        </TableCell>
        <TableCell>
          <Badge
            badgeContent={event.status}
            color={statusBadgeProps.color}
            sx={{
              "& .MuiBadge-badge": {
                minWidth: "60px",
                height: "24px",
                margin: "0 -20px",
              },
            }}
          />
        </TableCell>
        <TableCell>{formatDate(event.startTime)}</TableCell>
        <TableCell>{formatDate(event.endTime)}</TableCell>
        <TableCell>
          <IconButton aria-label="more" onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onDetail(event);
                handleMenuClose();
              }}
            >
              <VisibilityIcon fontSize="small" className="mr-2 text-zinc-500" />{" "}
              Detail
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                onEdit(event);
                handleMenuClose();
              }}
            >
              <EditIcon fontSize="small" className="mr-2 text-orange-400" />{" "}
              Edit
            </MenuItem> */}
            <MenuItem
              onClick={() => {
                onDelete(event);
                handleMenuClose();
              }}
            >
              <DeleteIcon fontSize="small" className="mr-2 text-red-500" />{" "}
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="p-4">
              <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                    <TableCell>Location:</TableCell>
                    <TableCell>{event.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Creator:</TableCell>
                    <TableCell>{event.createdByUsername}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Artists:</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {event.artists.length > 0 ? (
                          event.artists.map((artist) => (
                            <div
                              key={artist.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "4px 8px",
                                borderRadius: "8px",
                                backgroundColor: "#f3f4f6",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              <Avatar
                                src={artist.avatar}
                                alt={artist.name}
                                sx={{ width: 24, height: 24 }}
                              />
                              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                                {artist.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span>No artists linked</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Created At:</TableCell>
                    <TableCell>{formatDate(event.createdAt)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Updated At:</TableCell>
                    <TableCell>{formatDate(event.updatedAt)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const EventList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Tạo interval để cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval khi component unmount
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, isFetching } = useGetAllEventsQuery(
    {
      page,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
    },
    {
      // Thêm option để refetch khi currentTime thay đổi
      selectFromResult: ({ data, ...other }) => ({
        data: data
          ? {
              ...data,
              events: data.events.map((event) => ({
                ...event,
                status: determineEventStatus(event.startTime, event.endTime),
              })),
            }
          : data,
        ...other,
      }),
    }
  );

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Placeholder functions for actions
  const handleAddEvent = () => {
    navigate("/admin/event/add");
  };

  // const handleEditEvent = (event) => {
  //   navigate(`/admin/event/edit/${event.id}`);
  // };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleDetailEvent = (event) => {
    navigate(`/admin/event/detail/${event.id}`);
  };

  return (
    <div className="p-4">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
        <div className="flex gap-4">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
            placeholder="Search events..."
            disabled={isLoading}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
          />

          <FormControl variant="outlined" className="w-48" size="small">
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={isLoading}
              displayEmpty
              sx={{
                height: "40px",
                "& .MuiSelect-select": {
                  paddingTop: "6px",
                  paddingBottom: "6px",
                },
              }}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={15}>15 per page</MenuItem>
              <MenuItem value={20}>20 per page</MenuItem>
            </Select>
          </FormControl>
        </div>

        <button
          onClick={handleAddEvent}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Event
        </button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#18181b" }}>
              <TableCell width="5%" sx={{ color: "white" }}></TableCell>
              <TableCell width="5%" sx={{ color: "white" }}>
                #
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                Title
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                Category
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                Status
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                Start Date
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                End Date
              </TableCell>
              <TableCell width="10%" sx={{ color: "white" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.events?.map((event, index) => (
              <CollapsibleRow
                key={event.id}
                event={event}
                page={page}
                itemsPerPage={itemsPerPage}
                index={index}
                formatDate={formatDate}
                // onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onDetail={handleDetailEvent}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data?.totalPages > 1 && (
        <div className="flex justify-end items-center mt-4">
          <Stack spacing={2}>
            <Pagination
              count={data.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              disabled={isLoading}
              shape="rounded"
            />
          </Stack>
        </div>
      )}
      {isDeleteModalOpen && (
        <DeleteEventModal
          onClose={() => setIsDeleteModalOpen(false)}
          eventToDelete={eventToDelete}
        />
      )}
    </div>
  );
};

export default EventList;
