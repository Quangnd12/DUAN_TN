import React, { useState, useEffect } from "react";
import { BiPencil, BiX, BiImage } from "react-icons/bi";

const ImageUploadModal = ({ isOpen, onClose, onImageSelect, initialData }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(1);

    // Reset form when modal opens or initial data changes
    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.name || "");
            setDescription(initialData.description || "");
            setIsPublic(initialData.isPublic || 1);
            setImagePreview(initialData.image ? URL.createObjectURL(initialData.image) : null);
        }
    }, [isOpen, initialData]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        onImageSelect(selectedFile, title, description, isPublic);
        resetForm();
    };

    const resetForm = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setTitle("");
        setDescription("");
        setIsPublic(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#1E1E1E] rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <BiX className="text-3xl" />
                    </button>
                </div>

                {/* Image Upload Section */}
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
                            <div className="flex space-x-4">
                                <label 
                                    className={`flex-1 p-3 text-center rounded-lg cursor-pointer 
                                    ${isPublic === 1 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-[#2A2A2A] text-gray-400'}`}
                                >
                                    <input
                                        type="radio"
                                        className="hidden"
                                        checked={isPublic === 1}
                                        onChange={() => setIsPublic(1)}
                                    />
                                    Public
                                </label>
                                <label 
                                    className={`flex-1 p-3 text-center rounded-lg cursor-pointer 
                                    ${isPublic === 0 
                                        ? 'bg-gray-600 text-white' 
                                        : 'bg-[#2A2A2A] text-gray-400'}`}
                                >
                                    <input
                                        type="radio"
                                        className="hidden"
                                        checked={isPublic === 0}
                                        onChange={() => setIsPublic(0)}
                                    />
                                    Private
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

export default ImageUploadModal;