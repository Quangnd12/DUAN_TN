import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  useGetPlaylistByIdQuery,
  useRemoveSongFromPlaylistMutation,
} from "../../../../../../redux/slice/playlistSlice";
import { useTheme } from "../../ThemeContext";
import { translations } from "../../../../components/Translation/translation";
import PlaylistSongSelector from "./userAddSong";
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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { language } = useTheme();
  const t = translations[language].playlistDetail;
  const {
    data: playlist,
    isLoading,
    error,
  } = useGetPlaylistByIdQuery(playlistId);
  const [removeSongFromPlaylist, { isLoading: isRemoving }] =
    useRemoveSongFromPlaylistMutation();

  const [isSongSelectorOpen, setIsSongSelectorOpen] = useState(false);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongFromPlaylist({
        playlistId: playlist.id,
        songId,
      }).unwrap();
    } catch (err) {
      console.error(t.removeError, err);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{t.loadingError}</Alert>;

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: isSongSelectorOpen ? "calc(100% - 420px)" : "100%",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "auto",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <IconButton onClick={() => navigate(-1)} aria-label={t.backButton}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ ml: 2, fontWeight: "bold" }}>
            {playlist.name}
          </Typography>
          <IconButton
            onClick={() => setIsSongSelectorOpen(true)}
            aria-label={t.addSong}
            sx={{
              ml: "auto",
              backgroundColor: "#00796b",
              color: "white",
              "&:hover": { backgroundColor: "#004d40" },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxHeight: "calc(100vh - 150px)", overflow: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t.tableHeaders.number}</TableCell>
                <TableCell>{t.tableHeaders.title}</TableCell>
                <TableCell>{t.tableHeaders.artist}</TableCell>
                <TableCell>{t.tableHeaders.album}</TableCell>
                <TableCell>{t.tableHeaders.dateAdded}</TableCell>
                <TableCell>{t.tableHeaders.duration}</TableCell>
                <TableCell>{t.tableHeaders.actions}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playlist.songs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      {t.noSongs}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                playlist.songs?.map((song, index) => (
                  <TableRow
                    key={song.songId || song.id}
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "#f5f5f5",
                      },
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 1,
                            mr: 2,
                          }}
                          image={song.image || "/default-song.jpg"}
                          alt={song.title || song.name}
                        />
                        <Typography variant="body1" noWrap>
                          {song.title || song.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{song.artistNames || song.artist}</TableCell>
                    <TableCell>
                      {song.albumNames || song.album || "N/A"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(song.addedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{formatDuration(song.duration)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveSong(song.songId || song.id)}
                        disabled={isRemoving}
                        aria-label={t.confirmRemove}
                        sx={{
                          "&:hover": { color: "#d32f2f" },
                          position: "relative",
                        }}
                      >
                        {isRemoving ? (
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-12px",
                              marginLeft: "-12px",
                            }}
                          />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {isSongSelectorOpen && (
        <Box
          sx={{
            width: 400,
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            overflow: "auto",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <PlaylistSongSelector
            playlistId={playlist.id}
            onClose={() => setIsSongSelectorOpen(false)}
          />
        </Box>
      )}
    </Box>
  );
};

export default PlaylistDetail;
