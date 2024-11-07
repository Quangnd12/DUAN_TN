import { handleDelete } from "Admin/src/components/notification";
import React from "react";
import { MdDelete } from "react-icons/md";
import { deleteCountry } from "services/country";

const DeleteCountry = ({ onClose, CountryDelete, onDelete }) => {
    const handleConfirmDelete = async () => {
        try {
            // Gọi API để xóa genre
            await deleteCountry(CountryDelete.id);
            handleDelete();  // Gọi hàm thông báo đã xóa thành công

            // Cập nhật lại state trong component cha để genre bị xóa
            onDelete(CountryDelete.id);

            // Đóng modal sau khi xóa
            onClose();
        } catch (error) {
            console.error("Xóa genre không thành công:", error);
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
                        Are you sure you want to delete this item?
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

export default DeleteCountry;
