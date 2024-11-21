import React, { useState, useRef, useEffect } from "react";
import { BiX, BiImage } from "react-icons/bi";
import { handleUpdatePlaylistSuccess } from "../../../../../Client/src/components/notification"; // Import hàm thông báo

const ImageUploadModalDetail = ({ isOpen, onClose, onImageSelect, initialData }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(0);
    const modalRef = useRef(null);

    // Reset form when initial data changes
    useEffect(() => {
        if (initialData && isOpen) {
            setTitle(initialData.name || "");
            setDescription(initialData.description || "");
            setIsPublic(initialData.isPublic || 0);
            
            // Handle existing image preview
            if (initialData.image) {
                if (initialData.image instanceof File) {
                    setImagePreview(URL.createObjectURL(initialData.image));
                    setSelectedFile(initialData.image);
                } else {
                    setImagePreview(initialData.image);
                }
            } else {
                setImagePreview(null);
                setSelectedFile(null);
            }
        }
    }, [initialData, isOpen]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        const fileToSubmit = selectedFile instanceof File ? selectedFile : null;
        onImageSelect(fileToSubmit, title, description, isPublic);
        
        // Gọi thông báo cập nhật thành công
        handleUpdatePlaylistSuccess();

        onClose();
    };
    
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-[#1E1E1E] rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <BiX className="text-3xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    <div className="flex space-x-6">
                        {/* Image Preview */}
                        <div 
                            className="w-[250px] h-[250px] bg-[#2A2A2A] rounded-lg overflow-hidden 
                            flex items-center justify-center cursor-pointer 
                            hover:opacity-80 transition-opacity group"
                            onClick={() => document.getElementById('imageUpload').click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-gray-400 group-hover:text-white transition-colors">
                                    <BiImage className="text-6xl mx-auto mb-4" />
                                    <p className="font-semibold">Upload Image</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="imageUpload"
                            />
                        </div>

                        {/* Form Details */}
                        <div className="flex-1 space-y-4">
                            <input
                                type="text"
                                placeholder="Playlist Name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-[#2A2A2A] text-white rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <textarea
                                placeholder="Description (Optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 h-[150px] bg-[#2A2A2A] text-white rounded-lg 
                                resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            {/* Visibility Toggle */}
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="isPublic" 
                                    checked={isPublic === 1}
                                    onChange={() => setIsPublic(isPublic === 1 ? 0 : 1)}
                                    className="mr-2 h-4 w-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                                />
                                <label htmlFor="isPublic" className="text-white">
                                    Make this playlist public
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 text-right">
                        <button 
                            onClick={handleSubmit}
                            disabled={!title.trim()}
                            className="bg-green-600 text-white px-6 py-3 rounded-full 
                            hover:bg-green-700 transition-colors 
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Playlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModalDetail;
