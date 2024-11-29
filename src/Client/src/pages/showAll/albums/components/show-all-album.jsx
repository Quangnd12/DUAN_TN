import React, { useState, useEffect } from "react";
import { createAlbumSlug } from "../../../../components/createSlug";
import { Link } from "react-router-dom";
import { getAlbums } from "../../../../../../services/album"; // Import hàm gọi API

const ShowAllListAlbums = () => {
    const [albums, setAlbums] = useState([]); // State để lưu danh sách album
    const [isLoading, setIsLoading] = useState(true); // State để hiển thị trạng thái loading
    const [error, setError] = useState(null); // State để lưu lỗi (nếu có)

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await getAlbums(1, 12); // Gọi API, lấy trang 1, 12 item
                setAlbums(response.albums); // Lưu danh sách album
            } catch (err) {
                setError(err.message); // Lưu lỗi nếu có
            } finally {
                setIsLoading(false); // Tắt trạng thái loading
            }
        };

        fetchAlbums(); // Gọi hàm khi component được render
    }, []);

    if (isLoading) return <p>Loading...</p>; // Hiển thị loading
    if (error) return <p>Error: {error}</p>; // Hiển thị lỗi nếu có

    return (
        <div className="text-white bg-zinc-900 p-6 rounded-md w-full overflow-hidden">
            <div className="flex flex-col mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold">Popular Albums</h2>
                </div>
                <div className="grid grid-cols-6 gap-4 justify-items-center">
                    {albums.map((album) => (
                        <Link
                            to={`/album/${album.id}`} // Thay đổi đường dẫn để sử dụng album.id
                            key={album.id}
                        >
                            <div className="flex flex-col items-start mb-6">
                                <img
                                    src={album.image}
                                    alt={album.title}
                                    className="w-[170px] h-[170px] object-cover rounded-md"
                                />
                                <div className="mt-2 text-left">
                                    <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{album.title}</p>
                                    <p className="text-gray-400">{album.artistNames}</p> {/* Định dạng ngày tháng */}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowAllListAlbums;
