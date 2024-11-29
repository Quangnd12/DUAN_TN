import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArtists  } from "../../../../../../services/artist";
import { slugify } from "Client/src/components/createSlug";

const ShowAllListArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getArtists(page, limit); // Thay getAllArtists bằng getArtists
        
        // Lọc nghệ sĩ có ID trùng nhau
        const uniqueArtists = Object.values(
          response.artists.reduce((acc, artist) => {
            if (!acc[artist.id] || (artist.songID && !acc[artist.id].songID)) {
              acc[artist.id] = artist;
            }
            return acc;
          }, {})
        );

        setArtists(uniqueArtists);
        setTotalPages(response.totalPages || Math.ceil(uniqueArtists.length / limit));
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit]);

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Tính toán các nghệ sĩ cần hiển thị cho trang hiện tại
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPageArtists = artists.slice(startIndex, endIndex);

  return (
    <div className="text-white bg-zinc-900 p-6 rounded-md w-full overflow-hidden">
      <div className="flex flex-col mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Popular Artists</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
          {currentPageArtists.map((artist) => (
            <Link 
              to={`/artist/${slugify(artist.name)}`} 
              key={artist.id}
              className="transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img
                    src={artist.avatar || "/default-artist.jpg"}
                    alt={artist.name}
                    className="w-[170px] h-[170px] object-cover rounded-full shadow-lg"
                    onError={(e) => {
                      e.target.src = "/default-artist.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300"></div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">
                    {artist.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {artist.role === 1 ? "Artist" : "Rapper"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md ${
                page === 1
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md ${
                page === totalPages
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllListArtists;