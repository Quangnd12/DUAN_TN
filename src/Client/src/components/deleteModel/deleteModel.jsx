import React from "react";

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    cancelText = "Cancel",
    confirmText = "Delete",
    confirmButtonStyle = "bg-red-500 hover:bg-red-600",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#1E1E1E] text-white rounded-lg shadow-xl w-[400px] p-6">
                {/* Title */}
                <h2 className="text-xl font-semibold mb-4 text-gray-100">{title}</h2>

                {/* Message */}
                <p className="text-gray-400">{message}</p>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-300 hover:text-white"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white transition ${confirmButtonStyle}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
