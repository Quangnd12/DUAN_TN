import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetUserPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} from "../../../../../../redux/slice/playlistSlice";
import { format } from "date-fns";
import { useTheme } from "../../ThemeContext";
import { translations } from "../../../../components/Translation/translation";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  MusicNote as MusicNoteIcon,
} from "@mui/icons-material";

const UserPlaylist = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const t = translations[language].playlist;
  const { data: playlists = [], isLoading, error } = useGetUserPlaylistsQuery();
  const [createPlaylist] = useCreatePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistForm, setPlaylistForm] = useState({
    name: "",
    description: "",
    isPublic: false,
    image: null,
  });

  const fileInputRef = useRef(null);

  const handleCreateOrUpdatePlaylist = async () => {
    try {
      const playlistData = {
        name: playlistForm.name,
        description: playlistForm.description,
        isPublic: playlistForm.isPublic ? 1 : 0,
        image: playlistForm.image,
      };

      if (selectedPlaylist) {
        await updatePlaylist({
          playlistId: selectedPlaylist.id,
          ...playlistData,
        }).unwrap();
      } else {
        await createPlaylist(playlistData).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Playlist operation error:", err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deletePlaylist(playlistId).unwrap();
      } catch (err) {
        console.error("Delete playlist error:", err);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlaylist(null);
    setPlaylistForm({
      name: "",
      description: "",
      isPublic: false,
      image: null,
    });
  };

  const openEditMode = (playlist) => {
    setSelectedPlaylist(playlist);
    setPlaylistForm({
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.isPublic,
      image: null,
    });
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading playlists: {error.message}
      </Box>
    );
  }

  return (
    <Box className="p-2 max-w-full mx-auto">
      {/* Header Section */}
      <Box className="flex justify-between items-center mb-4">
        <Box>
          <Typography
            variant="h4"
            className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {t.pageTitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all"
        >
          {t.createPlaylist}
        </Button>
      </Box>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-2">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex">
              {/* Hình ảnh */}
              <img
                src={playlist.image || "/default-playlist.jpg"}
                alt={playlist.name}
                className="w-48 h-48 object-cover rounded-l-lg cursor-pointer"
                onClick={() => navigate(`/admin/playlists/${playlist.id}`)}
              />

              {/* Nội dung */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 truncate">
                    {playlist.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2 mb-2">
                    <div className="flex items-center">
                      <MusicNoteIcon
                        sx={{ fontSize: 16, marginRight: "4px" }}
                      />
                      <span>
                        {playlist.totalSongs} {t.songCount}
                      </span>
                    </div>
                    <span className="dot bg-gray-400"></span>
                    <div className="flex items-center">
                      {playlist.isPublic ? (
                        <PublicIcon
                          sx={{
                            fontSize: 16,
                            marginRight: "4px",
                            color: "#4CAF50",
                          }}
                        />
                      ) : (
                        <LockIcon
                          sx={{
                            fontSize: 16,
                            marginRight: "4px",
                            color: "#757575",
                          }}
                        />
                      )}
                      <span>
                        {playlist.isPublic ? t.publicLabel : t.privateLabel}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {t.createdAt}{" "}
                    {format(new Date(playlist.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Các nút hành động */}
                <div className="flex justify-start items-center space-x-4 pt-4">
                  <Tooltip title={t.editPlaylist} arrow>
                    <button
                      onClick={() => openEditMode(playlist)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>

                  <Tooltip title={t.confirmDelete} arrow>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 focus:outline-none"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {selectedPlaylist ? t.editPlaylist : t.createPlaylist}
        </DialogTitle>
        <DialogContent className="mt-8">
          <Box className="space-y-6 p-4">
            <TextField
              label={t.playlistName}
              value={playlistForm.name}
              onChange={(e) =>
                setPlaylistForm({ ...playlistForm, name: e.target.value })
              }
              fullWidth
              required
              className="mb-4"
            />
            <TextField
              label={t.description}
              value={playlistForm.description}
              onChange={(e) =>
                setPlaylistForm({
                  ...playlistForm,
                  description: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={3}
              className="mb-4"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={playlistForm.isPublic}
                  onChange={(e) =>
                    setPlaylistForm({
                      ...playlistForm,
                      isPublic: e.target.checked,
                    })
                  }
                  color="primary"
                />
              }
              label={t.publicPlaylist}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) =>
                setPlaylistForm({ ...playlistForm, image: e.target.files[0] })
              }
            />
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={() => fileInputRef.current.click()}
              fullWidth
              className="mt-4"
            >
              {playlistForm.image ? t.changeImage : t.uploadImage}
            </Button>
            {playlistForm.image && (
              <Typography
                variant="caption"
                className="block mt-2 text-gray-500"
              >
                Selected: {playlistForm.image.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseDialog} variant="outlined">
            {t.cancel}
          </Button>
          <Button
            onClick={handleCreateOrUpdatePlaylist}
            variant="contained"
            disabled={!playlistForm.name}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {selectedPlaylist ? t.updateButton : t.createButton}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPlaylist;
