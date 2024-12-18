import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGetAllEventsQuery } from "../../../../redux/slice/eventSlice";
import { getSongs } from "../../../../services/songs";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [artistOfWeek, setArtistOfWeek] = useState(null);
  const [artistTopSongs, setArtistTopSongs] = useState([]);

  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);

  const {
    data: eventsData,
    isLoading,
    isError,
  } = useGetAllEventsQuery({
    page: 1,
    limit: 5,
    sort: "createdAt",
    order: "DESC",
  });

  const events = eventsData?.events || [];

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePlayClick = (id) => {
    navigate(`/admin/event/detail/${id}`);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songsResponse = await getSongs(1, 100);
        if (songsResponse && songsResponse.songs) {
          setSongs(songsResponse.songs);

          // Chọn nghệ sĩ của tuần (có thể là nghệ sĩ đầu tiên hoặc logic chọn khác)
          const selectedArtist = songsResponse.songs[0].artist;
          setArtistOfWeek(selectedArtist);

          const artistSongs = songsResponse.songs
            .filter((song) => song.artist === selectedArtist)
            .sort((a, b) => b.listens_count - a.listens_count)
            .slice(0, 5); // Lấy 3 bài hát hàng đầu

          setArtistTopSongs(
            artistSongs.map((song, index) => ({
              title: song.title,
              plays: song.listens_count.toLocaleString(),
              duration: formatDuration(song.duration),
            }))
          );

          // Trích xuất các genre duy nhất
          const uniqueGenres = [
            ...new Set(songsResponse.songs.map((song) => song.genre)),
          ];
          setGenres(uniqueGenres);

          // Trích xuất danh sách artists duy nhất
          const uniqueArtists = songsResponse.songs.map((song) => ({
            name: song.artist,
            image: song.image,
          }));

          // Loại bỏ các artists trùng lặp
          const uniqueArtistsList = Array.from(
            new Map(
              uniqueArtists.map((artist) => [artist.name, artist])
            ).values()
          );

          setArtists(uniqueArtistsList);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (isLoading) return <div>Loading events...</div>;
  if (isError) return <div>Error loading events</div>;
  if (!events.length) return <div>No events found</div>;

  return (
    <div className="mx-auto py-1">
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Trendings Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Trendings</h2>
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={events[currentIndex].coverUrl || "default-image-url"}
              alt={events[currentIndex].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0  p-4">
              <h3 className="text-white text-xl font-bold">
                {events[currentIndex].name}
              </h3>
              <button
                className="mt-2 bg-white text-cyan-400 px-4 active:bg-gray-400  py-2 rounded-full outline-none focus:outline-none text-sm font-bold uppercase"
                onClick={() => handlePlayClick(events[currentIndex].id)}
              >
                Read <i className="fa fa-play ml-2" aria-hidden="true"></i>
              </button>
            </div>
            <div className="absolute bottom-4 flex justify-center w-full">
              {events.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></span>
              ))}
            </div>
            <button
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white  active:bg-gray-400 text-cyan-400 p-2 rounded-full outline-none focus:outline-none"
              onClick={handlePrevious}
            >
              <ChevronLeftIcon></ChevronLeftIcon>
            </button>
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white active:bg-gray-400 text-cyan-400 p-2 rounded-full outline-none focus:outline-none"
              onClick={handleNext}
            >
              <ChevronRightIcon></ChevronRightIcon>
            </button>
          </div>
        </div>

        {/* Artist of the week Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Artist of the week</h2>
          <div className="bg-white rounded-lg shadow-lg p-3  flex flex-col">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-5">
              <img
                src={songs.length > 0 ? songs[0].image : "default-image-url"}
                alt={artistOfWeek || "Artist"}
                className="w-28 h-28 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
              />
              <div>
                <h3 className="text-xl font-bold">
                  {artistOfWeek || "Artist Name"}
                </h3>
                <h4 className="text-2xl font-bold mt-2">Always Authentic</h4>
                <p className="text-gray-600 mt-2">
                  {artistOfWeek || "Artist Description"}
                </p>
              </div>
            </div>
            <ul className="flex-grow">
              <li className="flex justify-between items-center py-2 px-5 font-bold border-b bg-gray-100">
                <span className="w-6">#</span>
                <span className="flex-grow ml-4">Title</span>
                <span className="text-gray-700 mr-10">Plays</span>
                <span className="text-gray-700 w-12 text-right mr-10">Duration</span>
              </li>
              {artistTopSongs.map((song, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center py-2 p-5 border-b hover:shadow-md transition-shadow duration-300"
                >
                  <span className="w-6">{i + 1}</span>
                  <span className="flex-grow ml-4">{song.title}</span>
                  <span className="text-gray-500 mr-12">{song.plays}</span>
                  <span className="text-gray-500 w-12 text-right">
                    {song.duration}
                  </span>
                  {/* Cột icon tải về */}
                  <span className="text-gray-500 w-12 text-right">
                    <button className="text-gray-500 hover:text-gray-700 rounded outline-none focus:outline-none ">
                      <i className="fas fa-download"></i>
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 mt-10">
        {/* More new Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">More new</h2>
          <div className="grid grid-cols-2 gap-4">
            {events.slice(0, 4).map((event, index) => (
              <div
                key={index}
                onClick={() => handlePlayClick(event.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative cursor-pointer"
              >
                <img
                  src={event.coverUrl || "default-image-url"}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-sm font-bold text-white">{event.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 text-blue-500 font-semibold rounded outline-none focus:outline-none"
            onClick={() => navigate("/admin/event/show-all")}
          >
            More to new
          </button>
        </div>

        {/* Popular genres Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Popular genres</h2>
          <div className="rounded-lg shadow-lg p-6">
            <div className="flex flex-wrap -mx-1">
              {genres.map((genre, index) => (
                <button
                  key={index}
                  className="m-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm whitespace-nowrap"
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {artists.map((artist, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                  <p className="text-xs text-center">{artist.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
