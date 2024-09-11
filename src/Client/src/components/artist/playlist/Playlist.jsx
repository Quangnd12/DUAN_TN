import React, { useState } from "react";
import artistChoice from "../../../data/artistChoice";
import popularSongs from "../../../data/popularSongs";

function Playlist() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dropdownIndex, setDropdownIndex] = useState(null); // <-- **Phần mới thêm**

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionFollowClick = () => {
    setIsFollowing(!isFollowing);
    setShowOptions(false);
  };

  const handleDropdownClick = (index) => {
    // <-- **Phần mới thêm**
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  return (
    <div className="p-4 bg-zinc-800 bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="flex justify-start items-center space-x-7 mb-4">
        <button
          onClick={togglePlayPause}
          className="bg-green-500 text-white p-5 rounded-full"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm7 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.018 14L14.41 9.894a1 1 0 000-1.788L4.018 4A1 1 0 003 5v10a1 1 0 001.018 1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <button
          onClick={toggleFollow}
          className="text-white p-2 rounded-full border border-white ml-4"
        >
          {isFollowing ? "Đang theo dõi" : "Theo dõi"}
        </button>
        <div className="relative bottom-2 w-72">
          <button
            className="text-white p-2 rounded-full text-4xl ml-4"
            onClick={handleOptionsClick}
          >
            ...
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-72 z-40 bg-zinc-800 text-white rounded-lg drop-shadow-2xl p-4">
              <p className="mb-2 font-bold whitespace-nowrap">
                Các tùy chọn khác cho SOOBIN
              </p>
              <button
                onClick={handleOptionFollowClick}
                className="text-white p-2 w-full text-left hover:bg-gray-700"
              >
                {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
              </button>
              <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                Chuyển đến radio nghệ sĩ
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl text-white font-bold mb-4">Phổ biến</h2>
          <div className="space-y-4">
            {popularSongs.map((item, index) => (
              <div
                key={index}
                className={`relative grid grid-cols-3 items-center p-4 rounded-lg transition duration-300 ${
                  hoveredIndex === index ? "bg-gray-700" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center space-x-4 col-span-1">
                  <span className="text-white text-lg font-semibold">
                    {hoveredIndex === index ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.018 14L14.41 9.894a1 1 0 000-1.788L4.018 4A1 1 0 003 5v10a1 1 0 001.018 1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <p
                    className={`text-white whitespace-nowrap font-semibold cursor-pointer ${
                      hoveredIndex === index ? "underline" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
                <div className="text-gray-400 col-span-1 text-right">
                  {item.details}
                </div>
                <div className="text-gray-400 col-span-1 text-right flex justify-end items-center">
                  <span>{item.duration}</span>
                  {hoveredIndex === index && (
                    <div className="relative bottom-2 ml-5">
                      <button
                        className="text-gray-400 text-2xl"
                        onClick={() => handleDropdownClick(index)}
                      >
                        ...
                      </button>
                      {dropdownIndex === index && (
                        <div className="absolute z-10 left-3 p-2 mt-2 w-72 bg-zinc-950 text-white rounded-lg drop-shadow-2xl">
                          <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                            Thêm vào danh sách
                          </button>
                          <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                            Lưu vào bài hát đã thích của bạn
                          </button>
                          <button className="text-white p-2 w-full text-left hover:bg-gray-700">
                            Thêm vào danh sách chờ
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-white font-bold mb-4">
            Lựa chọn của nghệ sĩ
          </h2>
          <div className="cursor-pointer p-4 rounded-lg">
            <div className="flex items-center">
              <img
                src={artistChoice.image}
                alt={artistChoice.name}
                className="w-36 h-36 object-cover rounded-lg"
              />
              <div className="ml-4">
                <p className="text-white font-semibold">{artistChoice.name}</p>
                <p className="text-gray-400">{artistChoice.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
