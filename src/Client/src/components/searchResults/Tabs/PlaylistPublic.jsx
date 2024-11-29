import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetPlaylistByIdQuery } from "../../../../../../src/redux/slice/playlistSlice";

const PlaylistPublicInfo = () => {
    const { id: routePlaylistId } = useParams(); // Lấy ID từ URL
    const location = useLocation();
    
    // Ưu tiên lấy ID từ route state, nếu không có thì lấy từ useParams
    const playlistId = location.state?.playlistId || routePlaylistId;

    // Lấy dữ liệu playlist từ query
    const { data: playlistData, isLoading } = useGetPlaylistByIdQuery(playlistId, {
        skip: !playlistId
    });

    useEffect(() => {
        if (playlistData) {
            console.log("Fetched playlist data:", playlistData);
        }
    }, [playlistData]);

    // Render ảnh playlist hoặc placeholder
    const renderPlaylistImage = () => {
        if (playlistData?.image) {
            return playlistData.image;
        }
        return null; // Placeholder nếu không có ảnh
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative w-full h-[300px] flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    {/* Playlist Image */}
                    <div className="w-52 h-52 bg-[#282828] rounded-md overflow-hidden relative flex items-center justify-center">
                        {renderPlaylistImage() ? (
                            <img
                                src={renderPlaylistImage()}
                                alt="Playlist"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <span className="text-white font-semibold">No photo</span>
                            </div>
                        )}
                    </div>

                    {/* Playlist Information */}
                    <div className="text-white ml-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <h6 className="text-sm font-bold">Playlist</h6>
                            <span
                                className={`px-2 py-1 rounded text-xs ${
                                    playlistData?.isPublic === 1
                                        ? 'bg-green-500'
                                        : 'bg-gray-500'
                                }`}
                            >
                                {playlistData?.isPublic === 1 ? 'Public' : 'Private'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 pt-4">
                            <h6 className="text-5xl font-bold overflow-hidden text-ellipsis w-[700px] line-clamp-2">
                                {playlistData?.name || "Untitled Playlist"}
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
        </div>
    );
};

export default PlaylistPublicInfo;
