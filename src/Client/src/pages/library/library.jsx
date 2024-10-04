import React, { useState } from "react";
import Rowlib from "../../components/rowlibrary/rowlib";
import Footer from "../../components/footer/Footer";
import SongItem from "../../components/dropdown/dropdownMenu";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MdCheckBoxOutlineBlank, MdCheck, MdFavorite, MdFavoriteBorder, MdMoreVert, MdMusicNote } from "react-icons/md";
import MoreButton from "../../components/button/more"; // Import MoreButton

const initialData = {
  artist: [
    {
      id: 1,
      name: "Sơn Tùng MTP",
      image: "https://th.bing.com/th/id/OIP.fLnk_eILwplVquL4wn3t2gHaHa?rs=1&pid=ImgDetMain",
      title: "Artist",
    },
    {
      id: 2,
      name: "SOOBIN",
      image: "https://th.bing.com/th/id/OIP.xybS-OC0x_eE61F2CwIOgQHaHa?w=171&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      title: "Artist",
    },
  ],
  favoriteSongs: [
    {
      id: 1,
      song: "Hơn Cả Yêu",
      album: "Hơn Cả Yêu (Single)",
      time: "04:16",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMFqNnDtgQS2Y5nmIoeVbpJZQyjjh0wh8Q6Q&usqp=CAU",
      artist: "Đức Phúc",
    },
    {
      id: 2,
      song: "Đừng Yêu Nữa, Em Mệt Rồi",
      album: "Đừng Yêu Nữa, Em Mệt Rồi (Single)",
      time: "04:41",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIHP3cFgCbQnbK9-NMFZMWCFKzN2W76rAjXGJiKk1QdS3llzb99ZWZNdHN-7NnRkkgnbc&usqp=CAU",
      artist: "Min",
    },
    {
      id: 3,
      song: "Phía Sau Một Cô Gái",
      album: "Phía Sau Một Cô Gái",
      time: "04:38",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-m6lThdqAMqPFkVQMO1NAfJsodI7e-x9Sg&usqp=CAU",
      artist: "Soobin Hoàng Sơn",
    },
    {
      id: 4,
      song: "Yêu Một Người Vô Tâm",
      album: "Yêu Một Người Vô Tâm (Single)",
      time: "04:30",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVEmA8JMfn-KvxQEQrIsaRAEjQC1gFV3xpWA&usqp=CAU",
      artist: "Hương Tràm",
    },
    {
      id: 5,
      song: "Lạc Trôi",
      album: "Lạc Trôi (Single)",
      time: "03:56",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH14Asa_FbHmV3TaF5G0VTw0oAvbbEt5_zkA&usqp=CAU",
      artist: "Sơn Tùng MTP",
    },
  ],
};

const Library = () => {
  const [favoriteSongs, setFavoriteSongs] = useState(initialData.favoriteSongs);
  const [selectedSongs, setSelectedSongs] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleCheckboxChange = (id) => {
    setSelectedSongs((prevSelectedSongs) => {
      const updated = new Set(prevSelectedSongs);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      setIsSelectAllChecked(updated.size === favoriteSongs.length);
      return updated;
    });
  };

  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      setSelectedSongs(new Set());
    } else {
      const allSongIds = favoriteSongs.map((song) => song.id);
      setSelectedSongs(new Set(allSongIds));
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };

  const handleToggleLike = (id) => {
    setFavoriteSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, liked: !song.liked } : song
      )
    );
  };

  return (
    <HelmetProvider>
      <div className="text-gray-100 min-h-screen p-6">
        <Helmet>
          <title>Library</title>
          <meta name="description" content="This is the library page of our music app." />
        </Helmet>
        <Rowlib data={initialData.artist} />

        <div className="my-6 border-t border-gray-700"></div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Favorite Songs</h2>

          {/* Select All Checkbox */}
          {selectedSongs.size > 0 && (
            <div className="flex items-center mb-4" onClick={handleSelectAll}>
              <div className="cursor-pointer flex items-center">
                {isSelectAllChecked ? (
                  <MdCheck className="text-blue-400" size={23} />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-gray-400" size={23} />
                )}
                <span className="ml-2 text-gray-400">
                  {isSelectAllChecked ? "Deselect All" : "Select All"}
                </span>
              </div>
            </div>
          )}

          {/* Danh sách bài hát */}
          <div className="flex flex-col gap-4">
            {favoriteSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700"
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
              >
                <div className="flex items-center">
                  {/* Hiển thị checkbox hoặc nốt nhạc */}
                  <div className="cursor-pointer flex items-center" onClick={() => handleCheckboxChange(song.id)}>
                    {selectedSongs.has(song.id) ? (
                      <MdCheck className="text-blue-400" size={23} />
                    ) : hoveredSong === song.id ? (
                      <MdCheckBoxOutlineBlank className="text-gray-400" size={23} />
                    ) : (
                      <MdMusicNote className="text-blue-400" size={23} />
                    )}
                  </div>

                  <img src={song.image} alt={song.song} className="w-14 h-14 object-cover rounded-lg ml-2" />
                  <div className="ml-4">
                    <p className="text-sm font-semibold">{song.song}</p>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                </div>

                {/* Hiển thị like và MoreButton khi hover */}
                {hoveredSong === song.id ? (
                  <div className="flex items-center">
                    <div className="cursor-pointer text-gray-400 mr-4" onClick={() => handleToggleLike(song.id)}>
                      {song.liked ? (
                        <MdFavorite className="text-red-600" size={23} />
                      ) : (
                        <MdFavoriteBorder size={23} />
                      )}
                    </div>
                    <MoreButton
                      index={song.id}
                      dropdownIndex={dropdownOpen} // Pass the current dropdown state
                      handleDropdownToggle={() => toggleDropdown(song.id)} // Toggle dropdown function
                      dropdownRefs={{}} // Pass the required refs if needed
                      setShowShareOptions={() => { }} // Manage share options state
                      showShareOptions={false} // Manage share options visibility
                      align="right"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400">{song.time}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Library;
