import React from "react";
import { toast } from "react-toastify";

import "../../assets/css/notification/style.css";

const handleAddPlaylist = () => {
    toast.success("Song added to playlist", {
        autoClose: 2000,
        className: 'custom-toast',
    });
}

const handleAddFavorite = () => {
    toast.success("Song added to favorite", {
        autoClose: 2000,
        className: 'custom-toast-fav',
    });
}

const handleCopyLinkSong = () => {
    toast.success("The link has been copied to the clipboard", {
        autoClose: 2000,
        className: 'custom-toast-copy',
    })
}

export { handleAddPlaylist, handleAddFavorite, handleCopyLinkSong };