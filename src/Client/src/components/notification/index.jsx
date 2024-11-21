import React from "react";
import { toast } from "react-toastify";

import "../../assets/css/notification/style.css";

const handleAddPlaylist = () => {
    toast.success("Song added to playlist", {
        autoClose: 2000,
        className: 'custom-toast',
    });
};

const handleAddWaitlist = () => {
    toast.success("Song added to waiting list", {
        autoClose: 2000,
        className: 'custom-toast',
    });
};

const handleAddLibrary = () => {
    toast.success("Song added to library", {
        autoClose: 2000,
        className: 'custom-toast',
    });
};

const handleAddFavorite = () => {
    toast.success("Song added to favorite", {
        autoClose: 2000,
        className: 'custom-toast-fav',
    });
};

const handleCopyLinkSong = () => {
    toast.success("The link has been copied to the clipboard", {
        autoClose: 2000,
        className: 'custom-toast-copy',
    });
};

const handleAddReport = () => {
    toast.success("Response sent", {
        autoClose: 2000,
        className: 'custom-toast',
    });
};

// Thông báo yêu cầu chấp nhận điều khoản
const handleAcceptTerms = () => {
    toast.info("Please accept the terms and conditions", {
        autoClose: 2000,
        className: 'custom-toast-fav',
    });
};

// Thông báo tạo danh sách phát thành công
const handleCreatePlaylistSuccess = () => {
    toast.success("Playlist created successfully", {
        autoClose: 2000,
        className: 'custom-toast',
    });
};

// Thông báo cập nhật danh sách phát thành công
const handleUpdatePlaylistSuccess = () => {
    toast.success("Playlist updated successfully", {
        autoClose: 2000,
        className: 'custom-toast',
    });
};

// Thông báo xoá danh sách phát thành công
const handleDeletePlaylistSuccess = () => {
    toast.error("Playlist deleted successfully", {
        autoClose: 2000,
        className: 'custom-toast-fav',
    });
};

export { 
    handleAddPlaylist, 
    handleAddFavorite,
    handleAddWaitlist,
    handleAddLibrary, 
    handleCopyLinkSong, 
    handleAddReport,
    handleAcceptTerms,
    handleCreatePlaylistSuccess, // Xuất thông báo mới
    handleUpdatePlaylistSuccess, // Xuất thông báo mới
    handleDeletePlaylistSuccess, // Xuất thông báo xoá
};
