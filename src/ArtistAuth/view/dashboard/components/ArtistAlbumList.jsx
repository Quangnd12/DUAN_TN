import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  MusicNote as MusicNoteIcon,
} from "@mui/icons-material";
import {
  getArtistAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "../../../../redux/slice/artistAlbumSlice";
import MuiAlert from "@mui/material/Alert";


const ArtistAlbumList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { albums = [] } = useSelector((state) => state.artistAlbum || {});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const fileInputRef = useRef(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    albumId: null,
    albumTitle: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      release_date: "",
      cover_image: null,
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getArtistAlbums());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        release_date: data.release_date,
        cover_image: data.cover_image,
      };

      if (selectedAlbum) {
        await dispatch(
          updateAlbum({
            albumId: selectedAlbum.id,
            albumData: formData,
          })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Album updated successfully",
          severity: "success",
        });
      } else {
        await dispatch(createAlbum(formData)).unwrap();
        setSnackbar({
          open: true,
          message: "Create a new album successfully",
          severity: "success",
        });
      }

      handleCloseDialog();
      dispatch(getArtistAlbums());
    } catch (err) {
      console.error("Album operation error:", err);
      let errorMessage = "This album name already exists, please choose another name";
    
    // Xử lý trường hợp trùng tên album
    if (err.message && err.message.includes("Album name already exists")) {
      errorMessage = "This album name already exists, please choose another name";
    }

    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error",
    });
    }
  };

  const openDeleteModal = (album) => {
    setDeleteModal({
      open: true,
      albumId: album.id,
      albumTitle: album.title,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      albumId: null,
      albumTitle: "",
    });
  };

  const handleDeleteAlbum = async () => {
    try {
      await dispatch(deleteAlbum(deleteModal.albumId)).unwrap();
      setSnackbar({
        open: true,
        message: "Delete album successfully",
        severity: "success",
      });
      closeDeleteModal();
    } catch (err) {
      console.error("Delete album error:", err);
      setSnackbar({
        open: true,
        message: "Xóa album thất bại",
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAlbum(null);
    reset();
  };

  const openEditMode = (album) => {
    setSelectedAlbum(album);
    setValue("title", album.title || "");
    setValue("description", album.description || "");
    setValue(
      "release_date",
      album.release_date
        ? format(new Date(album.release_date), "yyyy-MM-dd")
        : ""
    );
    setValue("cover_image", null);
    setOpenDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("cover_image", file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      {/* Header Section */}
      <Box className="flex justify-between items-center mb-8">
        <Box className="flex items-center gap-4">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "white" }}
            className="hover:bg-white/10"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            My Albums
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
        >
          Create Album
        </Button>
      </Box>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(albums) && albums.length > 0 ? (
          albums.map((album) => (
            <div
              key={album.id}
              className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex">
                <img
                  src={album.cover_image || "/default-album.jpg"}
                  alt={album.title}
                  className="w-48 h-48 object-cover cursor-pointer"
                  onClick={() => navigate(`/artist-portal/albums/${album.id}`)}
                />

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 truncate">
                      {album.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {album.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
                        <span>{formatDate(album.release_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <MusicNoteIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
                        <span>{album.total_songs || 0} songs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start items-center space-x-4 mt-4">
                    <Tooltip title="Edit Album">
                      <button
                        onClick={() => openEditMode(album)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <EditIcon />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete Album">
                      <button
                        onClick={() => openDeleteModal(album)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Typography className="text-gray-400 col-span-3 text-center py-8">
            No albums found. Create your first album!
          </Typography>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            background: "linear-gradient(to bottom right, #1a1a1a, #2d1f3f)",
            color: "white",
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle className="border-b border-white/10">
            {selectedAlbum ? "Edit Album" : "Create New Album"}
          </DialogTitle>
          <DialogContent className="mt-4">
            <Box className="space-y-4">
              <TextField
                label="Album Title"
                {...register("title", {
                  required: "Album title is required",
                  minLength: {
                    value: 2,
                    message: "Title must have at least 2 characters",
                  },
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />

              <TextField
                label="Description"
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description must not exceed 500 characters",
                  },
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />

              <TextField
                type="date"
                label="Release Date"
                {...register("release_date", {
                  required: "Release date is required",
                })}
                error={!!errors.release_date}
                helperText={errors.release_date?.message}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
                inputProps={{
                  min: format(new Date(), 'yyyy-MM-dd'),
                }}
              />

              {selectedAlbum && selectedAlbum.cover_image && (
                <Box className="mt-2">
                  <Typography variant="caption" className="text-gray-400 mb-1">
                    Current Cover Image:
                  </Typography>
                  <img
                    src={selectedAlbum.cover_image}
                    alt="Current cover"
                    className="w-full h-40 object-cover rounded-md"
                  />
                </Box>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={() => fileInputRef.current.click()}
                fullWidth
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  "&:hover": { borderColor: "rgba(255,255,255,0.5)" },
                }}
              >
                {errors.cover_image ? (
                  <span className="text-red-500">
                    {errors.cover_image.message}
                  </span>
                ) : selectedAlbum?.cover_image ? (
                  "Update Cover Image"
                ) : (
                  "Upload Cover Image"
                )}
              </Button>

              {coverImagePreview && (
                <Box className="mt-2">
                  <Typography variant="caption" className="text-gray-400 mb-1">
                    Selected Image:
                  </Typography>
                  <img
                    src={coverImagePreview}
                    alt="Selected cover"
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Typography variant="caption" className="text-gray-400 mt-1">
                    {fileInputRef.current?.files[0]?.name || "No file selected"}
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions className="p-4 border-t border-white/10">
            <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            >
              {selectedAlbum ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModal.open}
        onClose={closeDeleteModal}
        PaperProps={{
          style: {
            background: "linear-gradient(to bottom right, #1a1a1a, #2d1f3f)",
            color: "white",
          },
        }}
      >
        <DialogTitle className="border-b border-white/10">
          Confirm album deletion
        </DialogTitle>
        <DialogContent className="mt-4">
          <Typography>
            Are you sure you want to delete the album "{deleteModal.albumTitle}
            "?
            <br />
            <span className="text-red-500">This action cannot be undone.</span>
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-white/10">
          <Button onClick={closeDeleteModal} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAlbum}
            variant="contained"
            color="error"
            className="hover:opacity-90"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ArtistAlbumList;
