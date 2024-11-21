import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import GenreCard from "../../components/grid_items/GenreCard";
import {getGenres} from '../../../../services/genres';

const AllGenre = () => {
  const [Genres, setGenres] = useState([]);

  const GenreData = async () => {
    const data = await getGenres();
    setGenres(data.genres || []);
};

useEffect(() => {
  GenreData();
}, []);

  return (
    <div className="container mx-auto p-6 rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">All Genres</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Genres.map((genre, index) => (
          <Link key={index} to={`/track/${genre.id}`} className={`transition-transform transform hover:scale-105 rounded-md shadow-md`}>
          <GenreCard genre={genre} />
        </Link>        
        ))}
      </div>
    </div>
  );
};
export default AllGenre;


