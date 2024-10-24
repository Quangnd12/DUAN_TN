import React from "react";
import { MdDelete } from "react-icons/md";
import { deleteArtist } from "../../../../../../services/artists";

const DeleteArtist = ({ onClose, artistToDelete, onDeleteSuccess }) => {
    const handleConfirmDelete = async () => {
        try {
            await deleteArtist(artistToDelete.id);
            console.log("Artist deleted:", artistToDelete);
            onDeleteSuccess(); // Gọi callback để cập nhật UI
            onClose(); // Đóng modal sau khi xóa
        } catch (error) {
            console.error("Error deleting artist:", error);
            // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-36 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <MdDelete className="text-red-600" size={28} />
                    </div>
                    <h3 className="text-base leading-6 font-medium text-gray-900 mt-4">
                        Are you sure you want to delete this artist?
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleConfirmDelete}
                            className="px-2 py-2 bg-red-600 text-white text-base font-medium rounded-md w-28 mr-2 hover:bg-red-700"
                        >
                            Yes, I'm sure
                        </button>
                        <button
                            onClick={onClose}
                            className="px-2 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 mr-2 hover:bg-gray-400"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteArtist;