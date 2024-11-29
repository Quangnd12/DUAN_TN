import React from "react";
import { MdDelete } from "react-icons/md";
import { useDeleteEventMutation } from "../../../../../../redux/slice/eventSlice";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const DeleteEventModal = ({ onClose, eventToDelete, onDeleteSuccess }) => {
  const [deleteEvent, { isLoading }] = useDeleteEventMutation();

  const handleConfirmDelete = async () => {
    try {
      // Call the deleteEvent mutation with the event ID
      await deleteEvent(eventToDelete.id).unwrap();
      
      // Show success notification
      toast.success("Event deleted successfully");
      
      // Call the success callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      // Handle any errors during deletion
      console.error("Failed to delete event:", error);
      toast.error(error?.data?.message || "Failed to delete event");
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
            Are you sure you want to delete this event?
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Event: {eventToDelete.name}
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className={`px-2 py-2 bg-red-600 text-white text-base font-medium rounded-md w-28 mr-2 hover:bg-red-700 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Deleting...' : 'Yes, I\'m sure'}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
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

export default DeleteEventModal;