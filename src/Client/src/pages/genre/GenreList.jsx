import React from "react";
import { Link } from "react-router-dom";
import GenreCard from "../../components/grid_items/GenreCard";

const AllGenre = () => {
  const genres = [
    { id: 1, name: "Pop", color: "bg-pink-400", coverArt: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg", path: "/genres/pop" },
    { id: 2, name: "Rock", color: "bg-gray-700", coverArt: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/abf84288090665.5df7012b227cc.jpg", path: "/genres/rock" },
    { id: 3, name: "Hip Hop", color: "bg-indigo-600", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/hip-hop" },
    { id: 4, name: "R&B", color: "bg-amber-500", coverArt: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/abf84288090665.5df7012b227cc.jpg", path: "/genres/rb" },
    { id: 5, name: "Jazz", color: "bg-teal-500", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/jazz" },
    { id: 6, name: "Classical", color: "bg-gray-300", coverArt: "https://i.pinimg.com/originals/96/6a/2b/966a2b3f5f307c4b97070b22623e6a9e.jpg", path: "/genres/classical" },
    { id: 7, name: "Country", color: "bg-yellow-500", coverArt: "https://i.pinimg.com/564x/48/e0/86/48e0865834fdbc664eef04e5a28be482.jpg", path: "/genres/country" },
    { id: 8, name: "EDM", color: "bg-blue-400", coverArt: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/abf84288090665.5df7012b227cc.jpg", path: "/genres/edm" },
    { id: 9, name: "Reggae", color: "bg-green-600", coverArt: "https://i.pinimg.com/originals/96/6a/2b/966a2b3f5f307c4b97070b22623e6a9e.jpg", path: "/genres/reggae" },
    { id: 10, name: "Blues", color: "bg-blue-800", coverArt: "https://i.pinimg.com/564x/48/e0/86/48e0865834fdbc664eef04e5a28be482.jpg", path: "/genres/blues" },
    { id: 11, name: "Metal", color: "bg-black", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/metal" },
    { id: 12, name: "Folk", color: "bg-green-500", coverArt: "https://i.pinimg.com/originals/96/6a/2b/966a2b3f5f307c4b97070b22623e6a9e.jpg", path: "/genres/folk" },
    { id: 13, name: "Latin", color: "bg-red-500", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/latin" },
    { id: 14,name: "Punk", color: "bg-red-600", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/punk" },
    { id: 15,name: "Indie", color: "bg-purple-500", coverArt: "https://i.pinimg.com/originals/96/6a/2b/966a2b3f5f307c4b97070b22623e6a9e.jpg", path: "/genres/indie" },
  ];

  return (
    <div className="container mx-auto p-6 rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">All Genres</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {genres.map((genre, index) => (
          <Link key={index} to={`/track?name=${genre.name}`} className={`transition-transform transform hover:scale-105 ${genre.color} rounded-lg p-4 shadow-md`}>
          <GenreCard genre={genre} />
        </Link>
        
        ))}
      </div>
    </div>
  );
};
export default AllGenre;


