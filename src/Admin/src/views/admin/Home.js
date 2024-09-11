import React, { useState, useEffect } from "react";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleDropdown, setVisibleDropdown] = useState(null);

  const images = [
    {
      url: "https://th.bing.com/th/id/R.f6f71e6d4dba067aa24e69e0115e7f18?rik=S1aYYH1odIyH3Q&pid=ImgRaw&r=0",
      title: "Red Snapper: Performance Review",
      description: "Kamella",
    },
    {
      url: "https://wallpapercave.com/wp/wp6619313.jpg",
      title: "Blue sad: People Crazy",
      description: "Demons Zez",
    },
    {
      url: "https://wallpapercave.com/wp/wp8930518.jpg",
      title: "Swich case machine",
      description: "Original Kalic",
    },
    {
      url: "https://wallpapercave.com/wp/wp8930689.jpg",
      title: "Young Dump: Last Night",
      description: "Jaxx",
    },
    {
      url: "https://wallpapercave.com/wp/wp8930689.jpg",
      title: "Young Dump: Last Night",
      description: "Jaxx",
    },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Hàm để xử lý việc click ra ngoài
  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown-btn") === null) {
      setVisibleDropdown(null); // Ẩn dropdown khi click ra ngoài
    }
  };

  // Thêm event listener khi component được mount
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const genres = [
    "Blues",
    "Classical",
    "Country",
    "Dance",
    "Electronic",
    "Hip-Hop",
    "Jazz",
    "Latin",
    "Metal",
    "Party",
    "R&B / Soul",
    "Reggae / Dancehall",
    "Soundtracks",
    "World",
  ];

  const artists = [
    { name: "Obito", image: "https://i.scdn.co/image/ab67616100005174a385bd3e0f67945f277792c2" },
    { name: "Grey D", image: "https://i.scdn.co/image/ab67616100005174d23b0ac7f33678be5753e1f5" },
    { name: "Mylina", image: "https://i.scdn.co/image/ab676161000051747294a1d514594b8e06c9fa5b" },
    { name: "VSTRA", image: "https://i.scdn.co/image/ab676161000051744003ce478669b0b238ebbc85" },
    { name: "J-97", image: "https://i.scdn.co/image/ab67616100005174704a391b2b46f2bad5aef48f" },
    { name: "Mono", image: "	https://i.scdn.co/image/ab676161000051748221305ea63809ddb999fbc4" },
  ];

  return (
    <div className="container mx-auto py-2">
      {/* Form*/}
      <div className="pt-16">
        <div className="px-4 md:px-10 mx-auto w-full">
          <form className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="w-5 h-5 text-gray-400">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Trendings Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Trendings</h2>
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={images[currentIndex].url}
              alt="Concert"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0  p-4">
              <h3 className="text-white text-xl font-bold">
                {images[currentIndex].title}
              </h3>
              <p className="text-gray-300">
                {images[currentIndex].description}
              </p>
              <button className="mt-2 bg-white text-cyan-400 px-4 active:bg-gray-400  py-2 rounded-full outline-none focus:outline-none text-sm font-bold uppercase">
                Play <i className="fa fa-play ml-2" aria-hidden="true"></i>
              </button>
            </div>
            <div className="absolute bottom-4 flex justify-center w-full">
              {images.map((_, index) => (
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
              <i className="fa fa-angle-left" aria-hidden="true"></i>
            </button>
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white active:bg-gray-400 text-cyan-400 p-2 rounded-full outline-none focus:outline-none"
              onClick={handleNext}
            >
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Artist of the week Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Artist of the week</h2>
          <div className="bg-white rounded-lg shadow-lg p-3  flex flex-col">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-5">
              <img
                src="https://i.pinimg.com/originals/81/c3/02/81c3027a6df879808365cd59c58d0f72.jpg"
                alt="Monica Lee"
                className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
              />
              <div>
                <h3 className="text-xl font-bold">Monica Lee</h3>
                <h4 className="text-2xl font-bold mt-2">Always Authentic</h4>
                <p className="text-gray-600 mt-2">Monica Lee</p>
              </div>
            </div>
            <ul className="flex-grow">
              {[
                { title: "No more time", plays: "43,822", duration: "3:21" },
                { title: "So easy", plays: "67,423", duration: "3:58" },
                { title: "With you", plays: "38,556", duration: "3:56" },
              ].map((song, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center py-2 p-5 border-b hover:shadow-md transition-shadow duration-300"
                >
                  <span className="w-6">{i + 1}</span>
                  <span className="flex-grow ml-4">{song.title}</span>
                  <span className="text-gray-500 mr-4">{song.plays}</span>
                  <span className="text-gray-500 w-12 text-right">
                    {song.duration}
                  </span>
                  {/* Cột icon tải về */}
                  <span className="text-gray-500 w-12 text-right">
                    <button className="text-gray-500 hover:text-gray-700 rounded outline-none focus:outline-none ">
                      <i className="fas fa-download"></i>
                    </button>
                  </span>
                  <span className="text-gray-500 w-12 text-right">
                    <button
                      className="dropdown-btn text-gray-500 hover:text-gray-700 rounded outline-none focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVisibleDropdown(visibleDropdown === i ? null : i);
                      }}
                    >
                      <i className="fas fa-ellipsis-h" />
                    </button>
                    {visibleDropdown === i && (
                      <div
                        id={`dropdown-${i}`}
                        className="absolute  right-10 bg-white rounded-lg shadow-lg p-4 w-28"
                      >
                        <span className="flex items-center py-2">
                          <button
                            type="button"
                            className="ml-2 rounded outline-none focus:outline-none"
                          >
                            <i className="fas fa-edit" /> Edit
                          </button>
                        </span>
                        <span className="flex items-center py-2">
                          <button className="ml-2 rounded outline-none focus:outline-none">
                            <i className="fas fa-trash" /> Delete
                          </button>
                        </span>
                      </div>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-3 text-right text-blue-500 font-semibold rounded outline-none focus:outline-none">
              Listen to full album
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 mt-10">
         {/* More new Section */}
         <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">More new</h2>
          <div className="grid grid-cols-2 gap-4">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-sm font-bold text-white">
                    {image.title}
                  </h3>
                  <p className="text-xs text-gray-200">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-500 font-semibold rounded outline-none focus:outline-none">
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
}

export default Home