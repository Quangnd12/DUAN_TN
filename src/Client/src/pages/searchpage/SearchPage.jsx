import React, { useState, useEffect, useMemo } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useLocation } from "react-router-dom";
import RecentSearchCard from "../../components/cards/RecentSearchCard";
import GenreCard from "../../components/cards/GenreCard";
import Footer from "../../components/footer/Footer";
import SearchResults from "../../components/searchResults/index";

// Move staticData outside of the component
const staticData = {
  topResults: {
    name: "Chúng ta của hiện tại",
    artist: "Sơn Tùng MTP",
    image: "https://i.scdn.co/image/ab676161000051745a79a6ca8c60e4ec1440be53",
  },
  songs: [
    {
      title: "Giá như",
      image:
        "https://th.bing.com/th/id/OIP.O7qQ-uIKKaG_xqiN4grG4AAAAA?rs=1&pid=ImgDetMain",
      name: "Không thể say",
      artist: "HIEUTHUHAI",
      duration: "3:00",
    },
    {
      title: "Giá như",
      image:
        "https://th.bing.com/th/id/OIP.O7qQ-uIKKaG_xqiN4grG4AAAAA?rs=1&pid=ImgDetMain",
      name: "Nắng đưa em đi",
      artist: "Sơn Tùng MTP",
      duration: "3:00",
    },
    {
      title: "Giá như",
      image:
        "https://th.bing.com/th/id/OIP.O7qQ-uIKKaG_xqiN4grG4AAAAA?rs=1&pid=ImgDetMain",
      name: "Gái như",
      artist: "Seetin",
      duration: "3:00",
    },
    {
      title: "Giá như",
      image:
        "https://th.bing.com/th/id/OIP.O7qQ-uIKKaG_xqiN4grG4AAAAA?rs=1&pid=ImgDetMain",
      name: "Bigcityboi",
      artist: "Binz",
      duration: "3:00",
    },
  ],
  albums: [
    {
      name: "Sky Tour",
      artist: "Sơn Tùng MTP",
      year: "2020",
      image:
        "https://th.bing.com/th/id/OIP.O7qQ-uIKKaG_xqiN4grG4AAAAA?rs=1&pid=ImgDetMain",
    },
    {
      name: "Ai chờ ai được mãi",
      artist: "HIEUTHUHAI",
      year: "2024",
      image:
        "https://th.bing.com/th/id/OIP.QURhMwQ6wsoWFcyhmzF8swHaHa?rs=1&pid=ImgDetMain",
    },
    {
      name: "Đứa nào làm em buồn",
      artist: "Soobin",
      year: undefined,
      image:
        "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/55/7d/2d/557d2df4-328b-77bb-85c7-806e276da588/085365350045.jpg/1200x1200bf-60.jpg",
    },
    {
      name: "Born pink",
      artist: "Binz",
      year: "2022",
      image:
        "https://th.bing.com/th/id/OIP.p_l4nbFWI3E04256pyHU5AHaHa?rs=1&pid=ImgDetMain",
    },
    {
      name: "Show của đen",
      artist: "Đen vâu",
      year: undefined,
      image:
        "https://media.vov.vn/sites/default/files/styles/large/public/2023-04/poster_show_0.jpg",
    },
  ],
  artists: [
    {
      name: "Sơn tùng MTP",
      image: "https://i.scdn.co/image/ab676161000051745a79a6ca8c60e4ec1440be53",
      role: "Artist",
    },
    {
      name: "Mono",
      image: "https://i.scdn.co/image/ab676161000051748221305ea63809ddb999fbc4",
      role: "Artist",
    },
    {
      name: "HIEUTHUHAI",
      image: "https://i.scdn.co/image/ab67616100005174e1cbc9e7ba8fbc5d7738ea51",
      role: "Artist",
    },
    {
      name: "Đen Vâu",
      image: "https://i.scdn.co/image/ab6761610000517491d2d39877c13427a2651af5",
      role: "Artist",
    },
    {
      name: "Vũ Cát Tường",
      image: "https://i.scdn.co/image/ab67616100005174e0e7dda97f41aae140ac029d",
      role: "Artist",
    },
  ],
  playlists: [
    {
      title: "My Playlist",
      author: "Jack 5 m",
      image:
        "https://mosaic.scdn.co/300/ab67616d00001e0206d6ca0ec5edd42245e72ea3ab67616d00001e024f68a75b0f7b7ffcb2ce88a2ab67616d00001e02b17bb8cf6af042c360f8d9d2ab67616d00001e02bf3bab82f02b0cb2660f1d47",
    },
    {
      title: "My Playlist",
      author: "Jack 1 m",
      image:
        "https://mosaic.scdn.co/300/ab67616d00001e0206d6ca0ec5edd42245e72ea3ab67616d00001e024f68a75b0f7b7ffcb2ce88a2ab67616d00001e02b17bb8cf6af042c360f8d9d2ab67616d00001e02bf3bab82f02b0cb2660f1d47",
    },
    {
      title: "My Playlist",
      author: "Jack 2 m",
      image:
        "https://mosaic.scdn.co/300/ab67616d00001e0206d6ca0ec5edd42245e72ea3ab67616d00001e024f68a75b0f7b7ffcb2ce88a2ab67616d00001e02b17bb8cf6af042c360f8d9d2ab67616d00001e02bf3bab82f02b0cb2660f1d47",
    },
    {
      title: "My Playlist",
      author: "Jack 3 m",
      image:
        "https://mosaic.scdn.co/300/ab67616d00001e0206d6ca0ec5edd42245e72ea3ab67616d00001e024f68a75b0f7b7ffcb2ce88a2ab67616d00001e02b17bb8cf6af042c360f8d9d2ab67616d00001e02bf3bab82f02b0cb2660f1d47",
    },
    {
      title: "My Playlist",
      author: "Jack 4 m",
      image:
        "https://mosaic.scdn.co/300/ab67616d00001e0206d6ca0ec5edd42245e72ea3ab67616d00001e024f68a75b0f7b7ffcb2ce88a2ab67616d00001e02b17bb8cf6af042c360f8d9d2ab67616d00001e02bf3bab82f02b0cb2660f1d47",
    },
  ],
};

const SearchPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([
    { name: "Soobin", role: "Artist", image: "soobin.jpg" },
    { name: "Taylor Swift", role: "Artist", image: "taylor.jpg" },
    { name: "Charlie Puth", role: "Artist", image: "charlie.jpg" },
    { name: "Harry Styles", role: "Song", image: "harry.jpg" },
  ]);

  // Use useMemo for genres array
  const genres = useMemo(
    () => [
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
    ],
    []
  );

  useEffect(() => {
    if (location.state && location.state.query) {
      setSearchResults(staticData);
    } else {
      setSearchResults(null);
    }
  }, [location.state]);

  const handleRemove = (index) => {
    setRecentSearches((prevSearches) => {
      const newSearches = [...prevSearches];
      newSearches.splice(index, 1);
      return newSearches;
    });
  };

  return (
    <HelmetProvider>
    <div className="bg-zinc-900 p-4 rounded-md">
      <Helmet>
        <title>Search Page</title>
        <meta
          name="description"
          content="This is the home page of our music app."
        />
      </Helmet>

      {searchResults ? (
        <SearchResults results={searchResults} />
      ) : (
        <>
          <div className="mb-8">
            <div className="flex justify-between">
              <h2 className="text-xl text-left text-white font-bold mb-4">
                Recent searches
              </h2>
              <Link className="text-white font-bold hover:text-sky-500" to={""}>
                Show all
              </Link>
            </div>
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
            <div className="flex justify-between">
              <h2 className="text-xl text-left font-bold mb-4 text-white">
                Browse all
              </h2>
              <Link className="text-white font-bold hover:text-sky-500" to={""}>
                Show all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre, index) => (
                <GenreCard key={index} genre={genre} />
              ))}
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
    </HelmetProvider>
  );
};

export default SearchPage;
