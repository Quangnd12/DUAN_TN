import React, { useState, useEffect } from "react";
import "../../../assets/css/artist/artist.css";
import { useParams, Link } from "react-router-dom";
import { getAlbumById } from "../../../../../services/album";
import { slugify } from "../../../components/createSlug";

const AlbumInfo = () => {
    const { id } = useParams(); // Lấy ID album từ URL
    const [album, setAlbum] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const response = await getAlbumById(id); // Sử dụng id từ useParams
                setAlbum(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [id]); // Thêm id vào dependency array để đảm bảo fetch lại khi id thay đổi

    // Hàm chuyển đổi giây sang định dạng phút:giây
    const formatDuration = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec`;
    };

    // Tính tổng thời lượng album
    const calculateTotalDuration = () => {
        if (album && album.songs) {
            const totalSeconds = album.songs.reduce((sum, song) => sum + song.duration, 0);
            return formatDuration(totalSeconds);
        }
        return "0 min 0 sec";
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!album) return <p>No album found</p>;

    return (
        <div className="relative w-full h-[300px] flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <div className="flex items-center">
                    <div className="w-52 h-52 album-image-border overflow-hidden">
                        <img
                            src={album.image}
                            alt="Album Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white ml-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <h6 className="text-sm font-bold">Album</h6>
                        </div>
                        <div className="flex items-center space-x-2">
                            <h6 className="text-5xl font-bold">{album.title}</h6>
                        </div>
                        <div className="flex items-center pt-2">
                            <Link to={`/artist/${slugify(album.artistName)}`} className="flex items-center space-x-2">
                              
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        src={album.artistAvatar}
                                        alt={`${album.artistName}'s Avatar`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-left text-lg mt-2 pr-4 hover:text-blue-500 hover:underline no-underline">
                                    {album.artistName}
                                </p>
                     
                              
                            </Link>
                            <div className="flex items-center">
                                <p style={{ fontSize: '40px', color: 'white', marginBottom: '20px', marginRight: '5px' }}>.</p>
                                <p className="text-left text-lg mt-2 mr-2 text-gray-400">
                                    {new Date(album.releaseDate).getFullYear()}
                                </p>
                                <p style={{ fontSize: '40px', color: 'white', marginBottom: '20px', marginRight: '5px' }}>.</p>
                                <p className="text-left text-lg mt-2 text-gray-400 ml-2">
                                    {calculateTotalDuration()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumInfo;
