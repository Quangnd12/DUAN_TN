import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlbums } from "../../../../../services/album";

const ArtistAlbum = () => {
  const { id: artistId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        const response = await getAlbums(1, 7);
        let albumData = [];

        if (response && response.data && response.data.albums) {
          albumData = response.data.albums;
        } else if (response && response.data) {
          albumData = response.data;
        } else if (response && Array.isArray(response)) {
          albumData = response;
        } else if (response && response.albums) {
          albumData = response.albums;
        }

        // Lọc 6 album đầu tiên
        const filteredAlbums = albumData.slice(0, 6);
        setAlbums(filteredAlbums);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu album:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        setIsLoading(false);
      }
    };
    fetchArtistAlbums();
  }, [artistId]);

  if (isLoading) return <div className="text-white">Đang tải...</div>;
  if (error) return <div className="text-white">{error}</div>;
  if (!albums || albums.length === 0) return <div className="text-white">Không tìm thấy album</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-white font-bold mb-4">Albums</h2>
        <Link to={`/artist/${artistId}/album`} className="text-blue-400 hover:underline">
          Show All
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-4 justify-items-center">
        {albums.map((album) => (
          <Link to={`/album/${album.id}`} key={album.id}>
            <div className="flex flex-col items-start">
              <img
                src={album.image}
                alt={album.title}
                className="w-[170px] h-[170px] object-cover rounded-md"
              />
              <div className="mt-2 text-left">
                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">
                  {album.title}
                </p>
                <p className="text-gray-400">
                  {`${new Date(album.releaseDate).getMonth() + 1}/${new Date(album.releaseDate).getFullYear()}`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbum;
