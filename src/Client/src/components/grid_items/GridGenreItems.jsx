import React from "react";
import { Link } from "react-router-dom";
import GenreCard from "../../components/grid_items/GenreCard";

const GridGenreItems = () => {
  const genres = [
    { name: "Music", color: "bg-gray-800", coverArt: "https://i.pinimg.com/736x/63/18/9c/63189cfab96209c5050ec74daa787958.jpg" },
    {
      name: "Vietnamese Music",
      color: "bg-gradient-to-r from-gray-500 to-cyan-500",
      coverArt: "https://media.viez.vn/prod/2024/6/15/large_Wren_Evans_Avt_3000x3000_554223c0f3.jpeg",
    },
    { name: "US-UK", color: "bg-zinc-800", coverArt: "https://i.pinimg.com/originals/96/6a/2b/966a2b3f5f307c4b97070b22623e6a9e.jpg" },
    { name: "Made For You", color: "bg-sky-700", coverArt: "https://img.ifunny.co/images/9fb6c1f8bb78b8662ab41acbfb9cc636a709470d48846af8f96e6d208123fcd1_1.jpg" },
    {
      name: "Live Events",
      color: "bg-purple-800",
      coverArt: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/abf84288090665.5df7012b227cc.jpg",
    },
    { name: "Soul", color: "bg-amber-600", coverArt: "https://i.pinimg.com/564x/48/e0/86/48e0865834fdbc664eef04e5a28be482.jpg" },

  ];
  const topCharts = [
    {
      id: "01",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "/api/placeholder/40/40",
    },
    {
      id: "02",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "/api/placeholder/40/40",
    },
    {
      id: "03",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "/api/placeholder/40/40",
    },
    {
      id: "04",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "/api/placeholder/40/40",
    },
    {
      id: "05",
      title: "Havanna",
      artist: "Camila Cabello",
      duration: "3:00",
      image: "/api/placeholder/40/40",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 ">
      <div className="bg-zinc-900 p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-left font-bold text-white">Genres</h2>
          <Link to="#" className="text-sm text-gray-400 hover:text-white">
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
          <Link to="#" className="text-sm text-gray-400 hover:text-white">
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
