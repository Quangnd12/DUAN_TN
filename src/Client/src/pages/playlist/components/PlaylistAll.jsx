import "../../../../../../src/Client/src/assets/css/playlist/playlist.css";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetUserPlaylistsQuery, useDeletePlaylistMutation } from "../../../../../../src/redux/slice/playlistSlice";
import { removeVietnameseTones } from "../../../../../../src/services/stringUtils";
import ConfirmationDialog from "../../../../../Client/src/components/deleteModel/deleteModel"; // Import dialog xác nhận
import { handleDeletePlaylistSuccess } from "../../../../../Client/src/components/notification"; // Import thông báo xoá thành công

const PlaylistAll = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetUserPlaylistsQuery();
  const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation();

  // State để điều khiển dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (data) {
      console.log("Fetched playlists:", data);
    }
  }, [data]);

  const handleView = (playlist) => {
    const playlistSlug = removeVietnameseTones(playlist.name);
    navigate(`/playlist/playlistdetail/${playlistSlug}`, { 
      state: { 
        playlistId: playlist.id,
        playlistName: playlist.name,
        playlistImage: playlist.image,
        description: playlist.description,
        isPublic: playlist.isPublic,
        totalSongs: playlist.totalSongs,
        createdAt: playlist.createdAt,
      } 
    });
  };

  const handleDelete = async (playlistId) => {
    try {
      await deletePlaylist(playlistId).unwrap();
      setIsDialogOpen(false); // Đóng dialog sau khi xóa
      handleDeletePlaylistSuccess(); // Gọi thông báo xoá thành công
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading playlists...</p>
      </div>
    );
  }

  if (error) {
    if (error.status === 401) {
      return (
        <div className="error-container">
          <p className="error-message">
            Unauthorized: Please log in to access your playlists.
          </p>
        </div>
      );
    }
    return (
      <div className="error-container">
        <p className="error-message">Error loading playlists: {error.message}</p>
      </div>
    );
  }

  const playlists = data || [];

  return (
    <div className="playlist-container">
      <h1 className="playlist-title">Your Playlists</h1>
      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <div className="playlist-header">
              <img
                src={playlist.image || "default-image-url.jpg"}
                alt={playlist.name}
                className="playlist-image cursor-pointer"
                onClick={() => handleView(playlist)}
              />
              <h2 className="playlist-name">{playlist.name}</h2>
              <span
                className={`playlist-status ${
                  playlist.isPublic ? "public" : "private"
                }`}
              >
                {playlist.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <p className="playlist-description">
              {playlist.description || "No description available."}
            </p>
            <div className="playlist-details">
              <div className="playlist-songs">
                <span className="songs-count">{playlist.totalSongs || 0}</span>
                <span className="songs-label">songs</span>
              </div>
              <div className="playlist-date">
                Created: {new Date(playlist.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="playlist-actions">
              <button
                className="action-button delete-button"
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setIsDialogOpen(true); // Mở dialog khi nhấn nút
                }}
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {playlists.length === 0 && (
        <div className="empty-playlist">
          <h3>No playlists yet</h3>
          <p>Get started by creating your first playlist!</p>
        </div>
      )}

      {/* Dialog xác nhận */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => handleDelete(selectedPlaylist?.id)}
        title="Delete Playlist"
        message={`Are you sure you want to delete the playlist "${selectedPlaylist?.name}"? This action cannot be undone.`}
        cancelText="Cancel"
        confirmText="Delete"
      />
    </div>
  );
};

export default PlaylistAll;
