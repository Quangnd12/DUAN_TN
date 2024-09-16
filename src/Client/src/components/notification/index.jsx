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

export { handleAddPlaylist, handleAddFavorite };