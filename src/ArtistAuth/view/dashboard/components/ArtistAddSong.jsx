import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { addSongsToAlbum } from "../../../../redux/slice/artistAlbumSlice";
import { getArtistSongs } from "../../../../redux/slice/artistSongSlice";

const ArtistAddSong = ({ albumId, onClose }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [addingSongs, setAddingSongs] = useState({});
  const [localAvailableSongs, setLocalAvailableSongs] = useState([]);

  const { songs, loading, error } = useSelector((state) => state.artistSong);
  const { currentAlbum } = useSelector((state) => state.artistAlbum);

  useEffect(() => {
    dispatch(getArtistSongs({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (songs && currentAlbum?.songs) {
      const filteredSongs = songs.filter(
        (song) => !currentAlbum.songs.some((albumSong) => albumSong.id === song.id)
      );
      setLocalAvailableSongs(filteredSongs);
    }
  }, [songs, currentAlbum]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddSong = async (song) => {
    try {
      setAddingSongs((prev) => ({ ...prev, [song.id]: true }));
      
      const result = await dispatch(
        addSongsToAlbum({
          albumId,
          songIds: [song.id],
        })
      ).unwrap();

      if (result.success) {
        // Cập nhật local state
        setLocalAvailableSongs(prev => prev.filter(s => s.id !== song.id));
      }
    } catch (err) {
      console.error("Failed to add song:", err);
    } finally {
      setAddingSongs((prev) => {
        const newState = { ...prev };
        delete newState[song.id];
        return newState;
      });
    }
  };

  // Sử dụng localAvailableSongs thay vì tính toán trực tiếp
  const filteredSongs = localAvailableSongs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box className="h-full flex flex-col bg-gray-900 text-white">
      <Box className="p-4 border-b border-white/10 flex justify-between items-center">
        <Typography variant="h6">Add songs to Album</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className="p-4">
        <TextField
          fullWidth
          placeholder="Search for songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
            },
          }}
        />
      </Box>

      <Box className="flex-1 overflow-auto p-4">
        {loading ? (
          <Box className="flex justify-center items-center h-full">
            <CircularProgress className="text-purple-500" />
          </Box>
        ) : (
          <Box className="space-y-3">
            {filteredSongs.length === 0 ? (
              <Typography className="text-center text-gray-400">
                No songs available
              </Typography>
            ) : (
              filteredSongs.map((song) => (
                <Card
                  key={song.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 60, height: 60 }}
                    image={song.image || "/default-song.jpg"}
                    alt={song.title}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" className="text-white">
                      {song.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                      {formatDuration(song.duration)}
                    </Typography>
                  </CardContent>
                  <IconButton
                    onClick={() => handleAddSong(song)}
                    disabled={addingSongs[song.id]}
                    sx={{
                      m: 1,
                      color: "white",
                      backgroundColor: "rgba(147,51,234,0.3)",
                      "&:hover": { backgroundColor: "rgba(147,51,234,0.5)" },
                    }}
                  >
                    {addingSongs[song.id] ? (
                      <CircularProgress size={24} className="text-purple-500" />
                    ) : (
                      <AddIcon />
                    )}
                  </IconButton>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ArtistAddSong;
