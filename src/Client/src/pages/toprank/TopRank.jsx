import React from "react";
import Footer from "../../components/footer/Footer";
import { Helmet, HelmetProvider } from 'react-helmet-async';
const data = [
  {
    id: 1,
    song: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng MTP",
    image: "https://th.bing.com/th/id/OIP.fLnk_eILwplVquL4wn3t2gHaHa?rs=1&pid=ImgDetMain",
    rating: 9.8,
    time: "3:50",
    album: "Sky Tour",
  },
  {
    id: 2,
    song: "Người Đưa Thư",
    artist: "Hiếu Thứ Hai",
    image: "https://i.scdn.co/image/ab6761610000e5eb17e2d498df7cbd7c43bd5e6a",
    rating: 9.2,
    time: "4:05",
    album: "Thói Quen",
  },
  {
    id: 3,
    song: "Va vào giai điệu này",
    artist: "GREY D",
    image: "https://th.bing.com/th/id/OIP.WshOb4R7xjxBCcmI-va5CAHaHa?rs=1&pid=ImgDetMain",
    rating: 9.0,
    time: "3:45",
    album: "Cuộc Hẹn",
  },
  {
    id: 4,
    song: "Thích em hơi nhiều",
    artist: "Wren Evans",
    image: "https://th.bing.com/th/id/OIP.YLbGsAe1-psdikDDn6zk-gHaHa?rs=1&pid=ImgDetMain",
    rating: 8.7,
    time: "4:15",
    album: "Phong Cách",
  },
  {
    id: 5,
    song: "Phía Sau Một Cô Gái",
    artist: "Soobin",
    image: "https://i.scdn.co/image/ab6761610000e5ebb9c9e23c646125922719489e",
    rating: 8.5,
    time: "3:30",
    album: "Chill cùng Soobin",
  },
];

const TopRank = () => {
  return (
    <HelmetProvider>
    <div className="relative text-white bg-gray-900">
      <Helmet>
        <title>Top-Rank</title>
        <meta
          name="description"
          content="This is the home page of our music app."
        />
      </Helmet>
      <div className="relative w-full h-64">
        <img
          src="https://i.scdn.co/image/ab6761610000e5eb17e2d498df7cbd7c43bd5e6a"
          alt="Playlist Cover"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4 bg-black/50 rounded-lg">
            <h2 className="text-5xl font-bold">Top 100 Rank</h2>
          </div>
        </div>
      </div>
      <div className="p-6">
        <table className="w-full table-auto rounded-lg shadow-lg bg-gray-800">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="p-4 text-lg">Rank</th>
              <th className="p-4 text-lg">Song</th>
              <th className="p-4 text-lg">Album</th>
              <th className="p-4 text-lg">Time</th>
              <th className="p-4 text-lg">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="transition-all duration-300 transform  hover:bg-gray-700"
                style={{
                  borderBottom: "1px solid #333",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4 flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.song}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-100">{item.song}</p>
                    <p className="text-gray-400 text-sm">{item.artist}</p>
                  </div>
                </td>
                <td className="p-4">{item.album}</td>
                <td className="p-4">{item.time}</td>
                <td className="p-4 text-yellow-400">{item.rating}</td>
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

export default TopRank;
