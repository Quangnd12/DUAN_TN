import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
  Chip,
  Button,
  LinearProgress,
  Pagination,
  Stack,
  Snackbar,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  getArtistSongs,
  deleteArtistSong,
} from "../../../../redux/slice/artistSongSlice";
import UploadTrack from "./UploadTrack";
import UpdateTrack from "./UpdateTrack";
import { useNavigate } from "react-router-dom";

const ArtistSongList = () => {
  const dispatch = useDispatch();
  const {
    songs = [],
    loading,
    error,
    totalPages,
  } = useSelector((state) => state.artistSong || {});

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getArtistSongs({ page, limit }));
  }, [dispatch, page, refreshKey]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDeleteSong = async (songId) => {
    try {
      await dispatch(deleteArtistSong(songId)).unwrap();
    } catch (err) {
      console.error("Lỗi khi xóa bài hát:", err);
    }
  };

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditClick = (song) => {
    setSelectedSong(song);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false);
    
    dispatch(getArtistSongs({ page, limit }))
      .unwrap()
      .catch(err => {
        console.error("Failed to refresh songs:", err);
        setSnackbar({
          open: true,
          message: err?.message || "An error occurred while uploading the song!",
          severity: "error"
        });
      });
      
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error">Có lỗi xảy ra khi tải danh sách bài hát</Alert>
    );

  const hasSongs = Array.isArray(songs) && songs.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "60em",
        overflow: "hidden",
        background:
          "linear-gradient(to bottom right, #1a1a2e, #16213e, #1a1a2e)",
        color: "white",
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "relative",
          overflow: "auto",
          maxHeight: "100%",
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "inherit",
            pb: 2,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "white",
              mr: 2,
              "&:hover": {
                background: "rgba(255,255,255,0.1)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(to right, #9333EA, #3B82F6)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Song list
          </Typography>
          <Button
            onClick={() => setIsUploadOpen(true)}
            startIcon={<AddIcon />}
            sx={{
              ml: "auto",
              background: "linear-gradient(to right, #9333EA, #3B82F6)",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: "12px",
              "&:hover": {
                background: "linear-gradient(to right, #8B31E3, #3575E3)",
                transform: "translateY(-2px)",
                boxShadow: "0 5px 15px rgba(147, 51, 234, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add New Track
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "calc(100vh - 150px)",
            overflow: "auto",
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "#",
                  "Title",
                  "Duration",
                  "Release Date",
                  "Premium",
                  "Explicit",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      fontWeight: "bold",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!hasSongs ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 8,
                      background: "transparent",
                      border: "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <MusicNoteIcon
                        sx={{
                          fontSize: 60,
                          color: "rgba(147, 51, 234, 0.5)",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          background:
                            "linear-gradient(to right, #9333EA, #3B82F6)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          fontWeight: "bold",
                        }}
                      >
                        here are no songs yet
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
                        Let's start uploading your first song
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                songs.map((song, index) => (
                  <TableRow
                    key={song.id}
                    sx={{
                      background: "transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255,255,255,0.05)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "12px",
                            mr: 2,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          }}
                          image={song.image || "/default-song.jpg"}
                          alt={song.title}
                        />
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: "500",
                            fontSize: "1.1rem",
                          }}
                        >
                          {song.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                      {formatDuration(song.duration)}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                      {format(new Date(song.releaseDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={song.is_premium ? "Premium" : "Free"}
                        sx={{
                          background: song.is_premium
                            ? "linear-gradient(to right, #9333EA, #3B82F6)"
                            : "rgba(255,255,255,0.1)",
                          color: "white",
                          fontWeight: "500",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={song.is_explicit ? "Explicit" : "Clean"}
                        sx={{
                          background: song.is_explicit
                            ? "rgba(239,68,68,0.2)"
                            : "rgba(34,197,94,0.2)",
                          color: song.is_explicit ? "#ef4444" : "#22c55e",
                          fontWeight: "500",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleDeleteSong(song.id)}
                          sx={{
                            color: "#ef4444",
                            "&:hover": {
                              background: "rgba(239,68,68,0.1)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(song)}
                          sx={{
                            color: "#3B82F6",
                            "&:hover": {
                              background: "rgba(59,130,246,0.1)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {hasSongs && (
          <Stack 
            spacing={2} 
            sx={{ 
              mt: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(to right, #9333EA, #3B82F6)',
                    borderColor: 'transparent',
                    '&:hover': {
                      background: 'linear-gradient(to right, #8B31E3, #3575E3)',
                    },
                  },
                },
              }}
            />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Showing {songs.length} songs
            </Typography>
          </Stack>
        )}
      </Box>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
           
            right: 0,
            zIndex: 1000,
          }}
        >
          <LinearProgress
            sx={{
              background: "rgba(255,255,255,0.1)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(to right, #9333EA, #3B82F6)",
              },
            }}
          />
        </Box>
      )}

      <UploadTrack
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <UpdateTrack
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdateSuccess={handleUpdateSuccess}
        songData={selectedSong}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArtistSongList;
