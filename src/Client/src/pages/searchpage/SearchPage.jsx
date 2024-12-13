import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useLocation } from "react-router-dom";
import RecentSearchCard from "../../components/cards/RecentSearchCard";
import GenreCard from "../../components/cards/GenreCard";
import Footer from "../../components/footer/Footer";
import SearchResults from "../../components/searchResults/index";
import { getAllArtists } from "../../../../services/artist";
import { getGenres } from "../../../../services/genres";

const SearchPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (location.state && location.state.results) {
      setSearchResults(location.state.results);
    } else {
      setSearchResults(null);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getAllArtists();
        const formattedArtists = response.artists.slice(0, 4).map(artist => ({
          id: artist.id,
          name: artist.name,
          role: artist.role === 1 ? "Artist" : "Singer",
          avatar: artist.avatar
        }));
        setRecentSearches(formattedArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleRemove = (index) => {
    setRecentSearches((prevSearches) => {
      const newSearches = [...prevSearches];
      newSearches.splice(index, 1);
      return newSearches;
    });
  };

  const renderDefaultSearchPage = () => (
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
              key={item.id || index}
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
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </div>
    </>
  );

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
          renderDefaultSearchPage()
        )}

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default SearchPage;
