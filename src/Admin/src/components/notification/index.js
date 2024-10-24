import React from "react";
import { toast } from "react-toastify";

const handleAdd = () => {
  toast.success("Added successfully", {
    autoClose: 2000,
  });
};

const handleEdit = () => {
  toast.success("Updated successfully", {
    autoClose: 2000,
  });
};

const handleDelete = () => {
  toast.success("Deleted successfully", {
    autoClose: 2000,
  });
};

const handleError = (errorType) => {
  let message = "An error occurred";
  
  switch (errorType) {
    case "duplicate_artist":
      message = "Artist name already exists!";
      break;
    case "duplicate_album":
      message = "Album name already exists!";
      break;
    case "duplicate_song":
      message = "Song name already exists!";
      break;
    case "duplicate_genre":
      message = "Genre name already exists!";
      break;
    default:
      message = "An unexpected error occurred!";
      break;
  }

  toast.error(message, {
    autoClose: 2000,
  });
};

export { handleAdd, handleEdit, handleDelete, handleError };
