import React from "react";
import { toast } from "react-toastify";

import "../../assets/css/notification/style.css";

const handleAddPlaylist = () => {
    toast.success("Song added to playlist", {
        autoClose: 2000,
        className: 'custom-toast',
    });
}
const handleAddWaitlist = () => {
    toast.success("Song added to waiting list", {
        autoClose: 2000,
        className: 'custom-toast',
    });
}
const handleAddLibrary = () => {
    toast.success("Song added to library", {
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

const handleAddReport = () => {
    toast.success("Response sent", {
        autoClose: 2000,
        className: 'custom-toast',
    });
}

export { handleAddPlaylist, handleAddFavorite,handleAddWaitlist,handleAddLibrary, handleCopyLinkSong, handleAddReport };
