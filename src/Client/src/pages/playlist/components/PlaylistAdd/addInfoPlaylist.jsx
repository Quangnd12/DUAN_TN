import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiPencil } from "react-icons/bi"; 
import ImageUploadModal from "./ImageUpload";
import { useCreatePlaylistMutation } from "../../../../../../../src/redux/slice/playlistSlice";
import { handleCreatePlaylistSuccess } from "../../../../../../Client/src/components/notification"; // Import hàm thông báo

const AddPlayListInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const playlistName = location.state?.playlistName || "New Playlist";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playlistData, setPlaylistData] = useState({
        name: playlistName,
        description: "",
        isPublic: 1, // Mặc định là 1
        image: null
    });
    const [createPlaylist] = useCreatePlaylistMutation();

    const handleImageSelect = async (imageFile, title, description, isPublic) => {
        try {
            const formData = {
                name: title || playlistData.name,
                description: description || playlistData.description,
                isPublic: isPublic !== undefined ? isPublic : playlistData.isPublic,
                image: imageFile
            };
    
            setPlaylistData(prev => ({
                ...prev,
                image: imageFile,
                name: title || prev.name,
                description: description || prev.description,
                isPublic: isPublic !== undefined ? isPublic : prev.isPublic
            }));
    
            await createPlaylist(formData).unwrap();
    
            // Hiển thị thông báo thành công
            handleCreatePlaylistSuccess();
    
            // Chuyển hướng về /playlist
            navigate(`/playlistall`);
        } catch (error) {
            console.error("Failed to create playlist:", error);
        }
    };
    
    return (
        <div className="relative w-full h-[300px] flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    <div className="w-52 h-52 bg-[#282828] rounded-md overflow-hidden relative flex items-center justify-center">
                        {playlistData.image ? (
                            <img
                                src={URL.createObjectURL(playlistData.image)}
                                alt="Uploaded"
                                className="w-full h-full object-cover"
                                onClick={() => setIsModalOpen(true)}
                            />
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center h-full cursor-pointer"
                                onClick={() => setIsModalOpen(true)}
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
                                {playlistData.name}
                            </h6>
                        </div>
                        <div className="flex items-center">
                            <p className="text-left text-lg pr-4 mt-2">{"nhituyet"}</p>
                            <div className="flex items-center">
                                <p style={{ fontSize: '40px', color: 'white', marginBottom: '20px', marginRight: '5px' }}>.</p>
                                <p className="text-left text-lg mt-2 text-gray-400">0 songs,</p>
                                <p className="text-left text-lg mt-2 text-gray-400 ml-2">0 min</p>
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
                initialData={playlistData}
            />
        </div>
    );
};

export default AddPlayListInfo;
