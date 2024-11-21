import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { getGenres } from "services/genres";
import GenreCard from "../../components/grid_items/GenreCard";

const GridGenreItems = () => {

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

  const [genres, setGenres] = useState([]);

  const GenreData = async () => {
    const data = await getGenres();
    setGenres(data.genres || []);
  };

  useEffect(() => {
      GenreData();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4 ">
      <div className="bg-zinc-900 p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-left font-bold text-white">Genres</h2>
          <Link to="/genre" className="text-sm text-gray-400 hover:text-white">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-zinc-900">
          {genres.slice(0,6).map((genre, index) => (
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
