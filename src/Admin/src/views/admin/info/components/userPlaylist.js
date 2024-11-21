import React, { useState, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from 'react-router-dom';
import {
  useGetUserPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} from "../../../../../../redux/slice/playlistSlice";
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
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import format from "date-fns/format";

const UserPlaylist = () => {
  const navigate = useNavigate();
  const { data: playlists = [], isLoading, error } = useGetUserPlaylistsQuery();
  const [createPlaylist, { isLoading: isCreating }] =
    useCreatePlaylistMutation();
  const [deletePlaylist, { isLoading: isDeleting }] =
    useDeletePlaylistMutation();
  const [updatePlaylist, { isLoading: isUpdating }] =
    useUpdatePlaylistMutation();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // State for form data
  const [playlistForm, setPlaylistForm] = useState(() => {
    // Tạo một file ảnh mặc định
    const defaultImageBlob = new Blob([""], { type: "image/jpeg" });
    const defaultImage = new File([defaultImageBlob], "default-playlist.jpg", {
      type: "image/jpeg",
    });

    return {
      name: "",
      description: "",
      isPublic: 0,
      image: defaultImage, // Gán ảnh mặc định thay vì null
    };
  });

  const fileInputRef = useRef(null);

  // Handlers for playlist CRUD operations
  const handleCreatePlaylist = async () => {
    try {
      // Truyền object thông thường thay vì FormData
      await createPlaylist({
        name: playlistForm.name,
        description: playlistForm.description,
        isPublic: playlistForm.isPublic ? 1 : 0,
        image: playlistForm.image,
      }).unwrap();
      setOpenCreateDialog(false);
      resetForm();
    } catch (err) {
      console.error("Create playlist error:", err);
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      // Truyền object thông thường thay vì FormData
      await updatePlaylist({
        playlistId: selectedPlaylist.id,
        name: playlistForm.name,
        description: playlistForm.description,
        isPublic: playlistForm.isPublic ? 1 : 0,
        image: playlistForm.image,
      }).unwrap();
      setOpenEditDialog(false);
      resetForm();
    } catch (err) {
      console.error("Update playlist error:", err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await deletePlaylist(playlistId).unwrap();
      } catch (err) {
        console.error("Delete playlist error:", err);
      }
    }
  };

  // Helper functions
  const resetForm = () => {
    const defaultImageBlob = new Blob([""], { type: "image/jpeg" });
    const defaultImage = new File([defaultImageBlob], "default-playlist.jpg", {
      type: "image/jpeg",
    });

    setPlaylistForm({
      name: "",
      description: "",
      isPublic: false,
      image: defaultImage,
    });
    setSelectedPlaylist(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPlaylistForm({
        ...playlistForm,
        image: file,
      });
    }
  };

  const openEditMode = (playlist) => {
    setSelectedPlaylist(playlist);
    const defaultImageBlob = new Blob([""], { type: "image/jpeg" });
    const defaultImage = new File([defaultImageBlob], "default-playlist.jpg", {
      type: "image/jpeg",
    });

    setPlaylistForm({
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.isPublic,
      image: defaultImage,
    });
    setOpenEditDialog(true);
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error">Error loading playlists: {error.message}</Alert>
    );

  return (
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">My playlists</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{
              backgroundColor: "#4A90E2",
              "&:hover": {
                backgroundColor: "#357ABD",
              },
            }}
          >
            Create New Playlist
          </Button>
        </Box>

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
                  className="w-48 h-48 object-cover rounded-l-lg"
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
                      <span>{playlist.totalSongs} songs</span>
                      <span className="dot bg-gray-400"></span>
                      <span>
                        {playlist.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Create at{" "}
                      {format(new Date(playlist.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>

                  {/* Các nút hành động */}
                  <div className="flex justify-start items-center space-x-4 pt-4">
                    <Tooltip title="Chỉnh sửa playlist" arrow>
                      <button
                        onClick={() => openEditMode(playlist)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                    </Tooltip>

                    <Tooltip title="Xóa playlist" arrow>
                      <button
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        disabled={isDeleting}
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

        {/* Create/Edit Playlist Dialog */}
        <Dialog
          open={openCreateDialog || openEditDialog}
          onClose={() => {
            setOpenCreateDialog(false);
            setOpenEditDialog(false);
            resetForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {openCreateDialog ? "Create New Playlist" : "Edit Playlist"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Playlist Name"
                value={playlistForm.name}
                onChange={(e) =>
                  setPlaylistForm({ ...playlistForm, name: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
                required
              />
              <TextField
                label="Description"
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
                sx={{ mb: 2 }}
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
                  />
                }
                label="Public Playlist"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={() => fileInputRef.current.click()}
                sx={{ mt: 2 }}
              >
                {playlistForm.image ? "Change Image" : "Upload Image"}
              </Button>
              {playlistForm.image && (
                <Typography variant="caption" display="block">
                  Selected: {playlistForm.image.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>Cancel</Button>
            <Button
              variant="contained"
              onClick={
                openCreateDialog ? handleCreatePlaylist : handleUpdatePlaylist
              }
              disabled={isCreating || isUpdating || !playlistForm.name}
            >
              {openCreateDialog ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default UserPlaylist;
