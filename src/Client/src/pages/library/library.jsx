import React, { useState } from "react";
import Rowlib from "../../components/rowlibrary/rowlib";
import Footer from "../../components/footer/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
const data = {
  artist: [
    {
      id: 1,
      name: "Sơn Tùng MTP",
      image:
        "https://th.bing.com/th/id/OIP.fLnk_eILwplVquL4wn3t2gHaHa?rs=1&pid=ImgDetMain",
      title: "Artist",
    },
    {
      id: 2,
      name: "SOOBIN",
      image:
        "https://th.bing.com/th/id/OIP.xybS-OC0x_eE61F2CwIOgQHaHa?w=171&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      title: "Artist",
    },
  ],
  favoriteSongs: [
    {
      id: 1,
      song: "Hơn Cả Yêu",
      album: "Hơn Cả Yêu (Single)",
      time: "04:16",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMFqNnDtgQS2Y5nmIoeVbpJZQyjjh0wh8Q6Q&usqp=CAU",
      artist: "Đức Phúc",
    },
    {
      id: 2,
      song: "Đừng Yêu Nữa, Em Mệt Rồi",
      album: "Đừng Yêu Nữa, Em Mệt Rồi (Single)",
      time: "04:41",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIHP3cFgCbQnbK9-NMFZMWCFKzN2W76rAjXGJiKk1QdS3llzb99ZWZNdHN-7NnRkkgnbc&usqp=CAU",
      artist: "Min",
    },
    {
      id: 3,
      song: "Phía Sau Một Cô Gái",
      album: "Phía Sau Một Cô Gái",
      time: "04:38",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-m6lThdqAMqPFkVQMO1NAfJsodI7e-x9Sg&usqp=CAU",
      artist: "Soobin Hoàng Sơn",
    },
    {
      id: 4,
      song: "Yêu Một Người Vô Tâm",
      album: "Yêu Một Người Vô Tâm (Single)",
      time: "04:30",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVEmA8JMfn-KvxQEQrIsaRAEjQC1gFV3xpWA&usqp=CAU",
      artist: "Hương Tràm",
    },
    {
      id: 5,
      song: "Lạc Trôi",
      album: "Lạc Trôi (Single)",
      time: "03:56",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH14Asa_FbHmV3TaF5G0VTw0oAvbbEt5_zkA&usqp=CAU",
      artist: "Sơn Tùng MTP",
    },
  ],
};

const Library = () => {
  const [selectedSongs, setSelectedSongs] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedSongs((prev) =>
      prev.includes(id) ? prev.filter((songId) => songId !== id) : [...prev, id]
    );
  };

  return (
    <HelmetProvider>
      <div className="bg-zinc-900 text-gray-100 min-h-screen p-6">
        <Helmet>
          <title>Library</title>
          <meta
            name="description"
            content="This is the home page of our music app."
          />
        </Helmet>
        <Rowlib title={"Thư viện"} data={data.artist} />
        <div className="my-6 border-t border-gray-700"></div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Danh Sách Bài Hát Yêu Thích
          </h2>
          <table className="w-full table-auto rounded-lg">
            <thead>
              <tr className="text-left text-gray-300 border-b border-gray-700">
                <th className="p-4 text-lg">#</th>
                <th className="p-4 text-lg">Bài Hát</th>
                <th className="p-4 text-lg">Album</th>
                <th className="p-4 text-lg">Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {data.favoriteSongs.map((item) => (
                <tr
                  key={item.id}
                  className="transition-all duration-300 transform hover:bg-gray-700"
                  style={{
                    borderBottom: "1px solid #333",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td className="p-4 flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.song}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p>{item.song}</p>
                      <p className="text-sm text-gray-400">{item.artist}</p>
                    </div>
                  </td>
                  <td className="p-4">{item.album}</td>
                  <td className="p-4">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Library;
