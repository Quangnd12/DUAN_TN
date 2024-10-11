import React from "react";
import { toast } from "react-toastify";


const handleAdd = () => {
    toast.success("Added success", {
        autoClose: 2000,
    });
}
const handleEdit = () => {
    toast.success("Updated success", {
        autoClose: 2000,
    });
}
const handleDelete = () => {
    toast.success("Deleted success", {
        autoClose: 2000,
    });
}



export { handleAdd,handleEdit,handleDelete };

