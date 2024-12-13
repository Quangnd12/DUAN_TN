import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch, useSelector } from 'react-redux';
import { getAlbumDetails, removeSongFromAlbum } from "../../../../redux/slice/artistAlbumSlice";
import ArtistAddSong from "./ArtistAddSong";
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
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

const ArtistAlbumDetail = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSongSelectorOpen, setIsSongSelectorOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Lấy dữ liệu từ Redux store
  const { currentAlbum: album, loading, error } = useSelector(state => state.artistAlbum);

  // Fetch album details khi component mount
  useEffect(() => {
    if (albumId) {
      dispatch(getAlbumDetails(albumId));
    }
  }, [dispatch, albumId]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRemoveSong = async (songId) => {
    try {
      setIsRemoving(true);
      await dispatch(removeSongFromAlbum({
        albumId: album.id,
        songId,
      })).unwrap();
      // Refresh album details sau khi xóa bài hát
      dispatch(getAlbumDetails(albumId));
    } catch (err) {
      console.error('Failed to remove song:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  if (loading) return (
    <Box className="flex justify-center items-center h-screen">
      <CircularProgress className="text-purple-500" />
    </Box>
  );
  
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!album) return <Alert severity="info">Album not found</Alert>;

  return (
    <Box className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Box className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-purple-900/30 to-transparent" />
      
      <Box className="relative container mx-auto px-4 py-6">
        {/* Header */}
        <Box className="flex items-center mb-8">
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ color: 'white', marginRight: 2 }}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h4" className="font-bold">
            {album?.title}
          </Typography>
        </Box>

        {/* Album Info */}
        <Box className="flex items-center gap-6 mb-8">
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200, borderRadius: 2 }}
            image={album?.cover_image || "/default-album.jpg"}
            alt={album?.title}
          />
          <Box>
            <Typography variant="h5" className="mb-2">
              {album?.title}
            </Typography>
            <Typography variant="body1" className="text-gray-400 mb-4">
              {album?.description}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Release Date: {format(new Date(album?.release_date), "MMMM d, yyyy")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsSongSelectorOpen(true)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            >
              Add Songs
            </Button>
          </Box>
        </Box>

        {/* Songs Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'gray', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>#</TableCell>
                <TableCell sx={{ color: 'gray', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Title</TableCell>
                <TableCell sx={{ color: 'gray', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Duration</TableCell>
                <TableCell sx={{ color: 'gray', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {album?.songs?.map((song, index) => (
                <TableRow 
                  key={song.id}
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Box className="flex items-center">
                      <CardMedia
                        component="img"
                        sx={{ width: 40, height: 40, borderRadius: 1, marginRight: 2 }}
                        image={song.image || "/default-song.jpg"}
                        alt={song.title}
                      />
                      <Typography>{song.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {formatDuration(song.duration)}
                  </TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <IconButton
                      onClick={() => handleRemoveSong(song.id)}
                      disabled={isRemoving}
                      sx={{ 
                        color: 'red',
                        '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' }
                      }}
                    >
                      {isRemoving ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Song Selector Sidebar */}
      {isSongSelectorOpen && (
        <Box
          className="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-xl transform transition-transform"
          sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ArtistAddSong
            albumId={album.id}
            onClose={() => setIsSongSelectorOpen(false)}
          />
        </Box>
      )}
    </Box>
  );
};

export default ArtistAlbumDetail;