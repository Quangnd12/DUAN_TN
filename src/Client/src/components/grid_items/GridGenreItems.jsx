import React from "react";
import { Link } from "react-router-dom";
import GenreCard from "../../components/grid_items/GenreCard";
// import AllGenre from "Client/src/pages/Genre/components/GenreList";

const GridGenreItems = () => {
  const genres = [
    { id: 1, name: "Pop", color: "bg-pink-400", coverArt: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg", path: "/genres/pop" },
    { id: 2, name: "Rock", color: "bg-gray-700", coverArt: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/abf84288090665.5df7012b227cc.jpg", path: "/genres/rock" },
    { id: 3, name: "Hip Hop", color: "bg-indigo-600", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/hip-hop" },
    { id: 4, name: "R&B", color: "bg-amber-500", coverArt: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/abf84288090665.5df7012b227cc.jpg", path: "/genres/rb" },
    { id: 5, name: "Jazz", color: "bg-teal-500", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg", path: "/genres/jazz" },
    { id: 6, name: "Classical", color: "bg-gray-300", coverArt: "https://i.pinimg.com/originals/96/6a/2b/966a2b3f5f307c4b97070b22623e6a9e.jpg", path: "/genres/classical" },
   

  ];
  const topCharts = [
    {
      id: "01",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg",
    },
    {
      id: "02",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg",
    },
    {
      id: "03",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg",
    },
    {
      id: "04",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg",
    },
    {
      id: "05",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 ">
      <div className="bg-zinc-900 p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-left font-bold text-white">Genres</h2>
          <Link to="/allgenre" className="text-sm text-gray-400 hover:text-white">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-zinc-900">
          {genres.map((genre, index) => (
            <GenreCard key={index} genre={genre} />
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-left font-bold text-white">Top Charts</h2>
          <Link to="" className="text-sm text-gray-400 hover:text-white">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {topCharts.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between text-white"
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 w-6">{song.id}</span>
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-10 h-10 rounded"
                />
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <span className="text-gray-400">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridGenreItems;
