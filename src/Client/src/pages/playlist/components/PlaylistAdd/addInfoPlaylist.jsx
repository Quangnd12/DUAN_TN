import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BiPencil } from "react-icons/bi"; 
import ImageUploadModal from "./ImageUpload";

const AddPlayListInfo = () => {
    const location = useLocation();
    const playlistName = location.state?.playlistName || "No playlist name provided";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageSelect = (img, title, description) => {
        setImage(img);
        // Xử lý title và description nếu cần
        console.log("Title:", title);
        console.log("Description:", description);
    };

    return (
        <div className="relative w-full h-[300px] flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    <div className="w-52 h-52 bg-[#282828] rounded-md overflow-hidden relative flex items-center justify-center">
                        {image ? (
                            <img
                                src={image}
                                alt="Uploaded"
                                className="w-full h-full object-cover"
                                onClick={() => setIsModalOpen(true)} // Mở modal khi click vào hình ảnh
                            />
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center h-full cursor-pointer"
                                onClick={() => setIsModalOpen(true)} // Mở modal khi click vào icon
                            >
                                <BiPencil className="text-white text-4xl mb-2" />
                                <span className="text-white font-semibold">Select photo</span>
                            </div>
                        )}
                    </div>

                    {/* Thông tin playlist */}
                    <div className="text-white ml-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <h6 className="text-sm font-bold">Playlist</h6>
                        </div>
                        <div className="flex items-center space-x-2 pt-4">
                            <h6 className="text-5xl font-bold overflow-hidden text-ellipsis w-[700px] line-clamp-2">
                                {playlistName}
                            </h6>
                        </div>
                        <div className="flex items-center">
                            <p className="text-left text-lg pr-4 mt-2">{"nhituyet"}</p>
                            <div className="flex items-center">
                                <p style={{ fontSize: '40px', color: 'white', marginBottom: '20px', marginRight: '5px' }}>.</p>
                                <p className="text-left text-lg mt-2 text-gray-400">1 songs,</p>
                                <p className="text-left text-lg mt-2 text-gray-400 ml-2">{"30 min 28 sec"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImageSelect={handleImageSelect}
            />
        </div>
    );
};

export default AddPlayListInfo;
