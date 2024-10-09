import React, { useState, useRef, useEffect } from "react";
import { BiPencil, BiX } from "react-icons/bi";

const ImageUploadModal = ({ isOpen, onClose, onImageSelect }) => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const modalRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleSubmit = () => {
        onImageSelect(image, title, description);
        onClose();
    };

    const handleOutsideClick = (event) => {
        // Kiểm tra nếu click nằm ngoài modal
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Thêm sự kiện click vào document khi modal mở
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            // Xóa sự kiện khi modal đóng
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div ref={modalRef} className="bg-[#252525] p-6 rounded-md shadow-lg w-[550px] h-[300px] relative">
                <button
                    className="absolute top-2 right-2 text-white text-2xl"
                    onClick={onClose} 
                >
                    <BiX />
                </button>
                <div className="flex mb-4 mt-6">
                    <div className="w-[180px] h-[180px] bg-[#3e3e3e] rounded-md overflow-hidden relative flex items-center justify-center mr-4">
                        {image ? (
                            <img
                                src={image}
                                alt="Uploaded"
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => document.getElementById('imageUpload').click()}
                            />
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center h-full cursor-pointer"
                                onClick={() => document.getElementById('imageUpload').click()}
                            >
                                <BiPencil className="text-white text-4xl mb-2" />
                                <span className="text-white font-semibold">Select photo</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden rounded-md"
                        id="imageUpload"
                    />
                    <div className="flex flex-col justify-between flex-1">
                        <input
                            type="text"
                            placeholder="Name playlist"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-[#3e3e3e] p-2 mb-2 w-full focus:border-white-500 focus:outline-none focus:border rounded-md"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-[#3e3e3e] p-2 w-full h-[130px] focus:border-white-500 focus:outline-none focus:border rounded-md"
                        />
                    </div>
                </div>
                <div className="flex justify-end">            
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
