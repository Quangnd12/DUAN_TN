import React, { useState } from "react";
import RecentSearchCard from "../../components/cards/RecentSearchCard";
import GenreCard from "../../components/cards/GenreCard";

const SearchPage = () => {
  const [recentSearches, setRecentSearches] = useState([
    { name: "Soobin", role: "Artist", image: "soobin.jpg" },
    { name: "Taylor Swift", role: "Artist", image: "taylor.jpg" },
    { name: "Charlie Puth", role: "Artist", image: "charlie.jpg" },
    { name: "Harry Styles", role: "Song", image: "harry.jpg" },
  ]);

  const genres = [
    { name: "Music", color: "bg-red-500", coverArt: "CoverArt.jpg" },
    {
      name: "Vietnamese Music",
      color: "bg-amber-200",
      coverArt: "CoverArt2.jpg",
    },
    { name: "US-UK", color: "bg-cyan-500", coverArt: "CoverArt3.jpg" },
    { name: "Made For You", color: "bg-sky-700", coverArt: "CoverArt4.jpg" },
    {
      name: "Live Events",
      color: "bg-purple-600",
      coverArt: "CoverArt5.jpg",
    },
    { name: "Soul", color: "bg-amber-600", coverArt: "CoverArt6.jpg" },
    { name: "Blue", color: "bg-stone-300", coverArt: "CoverArt7.jpg" },
    { name: "Comedy", color: "bg-blue-600", coverArt: "CoverArt8.jpg" },
  ];

  const handleRemove = (index) => {
    const newSearches = [...recentSearches];
    newSearches.splice(index, 1);
    setRecentSearches(newSearches);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute top-full right-2 mt-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-2 px-10 whitespace-nowrap">
              Thông tin mới
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl text-left text-white font-bold mb-4">
          Recent searches
        </h2>
        <div className="flex space-x-8 overflow-x-auto">
          {recentSearches.map((item, index) => (
            <RecentSearchCard
              key={index}
              item={item}
              index={index}
              handleRemove={handleRemove}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl text-left font-bold mb-4 text-white">
          Browse all
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre, index) => (
            <GenreCard key={index} genre={genre} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
