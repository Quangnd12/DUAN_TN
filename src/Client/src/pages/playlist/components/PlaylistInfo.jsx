import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BiPencil } from "react-icons/bi"; 
import ImageUploadModalDetail from "./ImageDetailUpload";
import { 
    useUpdatePlaylistMutation, 
    useGetPlaylistByIdQuery 
} from "../../../../../../src/redux/slice/playlistSlice";

const PlayListInfo = () => {
    const { id: routePlaylistId } = useParams(); // Lấy ID từ URL
    const location = useLocation();
    const navigate = useNavigate();
    
    // Ưu tiên lấy ID từ route state, nếu không có thì lấy từ useParams
    const playlistId = location.state?.playlistId || routePlaylistId;

    // Lấy dữ liệu playlist từ query
    const { data: playlistData, isLoading } = useGetPlaylistByIdQuery(playlistId, {
        skip: !playlistId
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localPlaylistData, setLocalPlaylistData] = useState({
        id: playlistId,
        name: "",
        description: "",
        isPublic: 0,
        image: null
    });

    const [updatePlaylist] = useUpdatePlaylistMutation();

    // Cập nhật local state khi có dữ liệu từ query
    useEffect(() => {
        if (playlistData) {
            setLocalPlaylistData({
                id: playlistData.id,
                name: playlistData.name || "",
                description: playlistData.description || "",
                isPublic: playlistData.isPublic || 0,
                image: playlistData.image || null
            });
        }
    }, [playlistData]);

    // Handle image selection/update
    const handleImageSelect = async (imageFile, title, description, isPublic) => {
        try {
            const formData = {
                playlistId: localPlaylistData.id,
                name: title || localPlaylistData.name,
                description: description || localPlaylistData.description,
                isPublic: isPublic !== undefined ? isPublic : localPlaylistData.isPublic, // Ưu tiên giá trị mới
                image: imageFile,
            };
    
            // Cập nhật local state
            setLocalPlaylistData((prev) => ({
                ...prev,
                image: imageFile,
                name: title || prev.name,
                description: description || prev.description,
                isPublic: isPublic !== undefined ? isPublic : prev.isPublic,
            }));
    
            // Gọi API để cập nhật
            await updatePlaylist(formData).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update playlist:", error);
        }
    };
    

    // Toggle playlist visibility
    const handleToggleVisibility = async () => {
        try {
            const newVisibility = localPlaylistData.isPublic === 1 ? 0 : 1;
    
            const formData = {
                playlistId: localPlaylistData.id,
                name: localPlaylistData.name,
                description: localPlaylistData.description,
                isPublic: newVisibility,
                image: localPlaylistData.image,
            };
    
            // Gọi API để cập nhật
            const updatedData = await updatePlaylist(formData).unwrap();
    
            // Đồng bộ toàn bộ dữ liệu từ server
            setLocalPlaylistData(updatedData);
        } catch (error) {
            console.error("Failed to update playlist visibility:", error);
        }
    };
    
    

    // Render image or placeholder
    const renderPlaylistImage = () => {
        if (localPlaylistData.image) {
            // If it's a File object (newly selected)
            if (localPlaylistData.image instanceof File) {
                return URL.createObjectURL(localPlaylistData.image);
            }
            // If it's an existing image URL
            return localPlaylistData.image;
        }
        return null;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative w-full h-[300px] flex">
            {/* Phần còn lại của component giữ nguyên */}
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    <div className="w-52 h-52 bg-[#282828] rounded-md overflow-hidden relative flex items-center justify-center">
                        {renderPlaylistImage() ? (
                            <img
                                src={renderPlaylistImage()}
                                alt="Playlist"
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

                    {/* Playlist Information */}
                    <div className="text-white ml-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <h6 className="text-sm font-bold">Playlist</h6>
                            <button 
                                onClick={handleToggleVisibility}
                                className={`px-2 py-1 rounded text-xs ${
                                    localPlaylistData.isPublic === 1 
                                        ? 'bg-green-500 hover:bg-green-600' 
                                        : 'bg-gray-500 hover:bg-gray-600'
                                }`}
                            >
                                {localPlaylistData.isPublic === 1 ? 'Public' : 'Private'}
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 pt-4">
                            <h6 className="text-5xl font-bold overflow-hidden text-ellipsis w-[700px] line-clamp-2">
                                {localPlaylistData.name}
                            </h6>
                        </div>
                        <div className="flex items-center">
                            <p className="text-left text-lg pr-4 mt-2">{"nhituyet"}</p>
                            <div className="flex items-center">
                                <p style={{ fontSize: '40px', color: 'white', marginBottom: '20px', marginRight: '5px' }}>.</p>
                                <p className="text-left text-lg mt-2 text-gray-400">
                                    {playlistData?.totalSongs || 0} songs,
                                </p>
                                <p className="text-left text-lg mt-2 text-gray-400 ml-2">
                                    {playlistData?.createdAt ? new Date(playlistData.createdAt).toLocaleDateString() : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Editing Playlist */}
            <ImageUploadModalDetail
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImageSelect={handleImageSelect}
                initialData={localPlaylistData}
            />
        </div>
    );
};

export default PlayListInfo;