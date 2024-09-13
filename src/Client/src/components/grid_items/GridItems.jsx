import React from "react";

const albums = [
  {
    title: "Perfect",
    cover:
      "https://th.bing.com/th/id/OIP.sIT_F2bUR3uKRBL-8ZkR6AHaHa?rs=1&pid=ImgDetMain",
  },
  {
    title: "La la la",
    cover:
      "https://th.bing.com/th/id/OIP.AMuG3onNRJC_BpSDKTxSVAHaHo?rs=1&pid=ImgDetMain",
  },
  {
    title: "Giá như",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/34/e5/8d/34e58dfa-6f9e-3c97-f6d5-77d1fdc7ec3d/085365595453.jpg/1200x1200bf-60.jpg",
  },
  {
    title: "Trái đất ôm mặt trời",
    cover:
      "https://th.bing.com/th/id/OIP.AyrSMU_cH8l72_T22wG9zgHaHa?rs=1&pid=ImgDetMain",
  },
  {
    title: "Chạy khỏi thế giới này",
    cover: "https://i.ytimg.com/vi/hYYMF3VtOjE/maxresdefault.jpg",
  },
  {
    title: "Senorita",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/46/fe/4a/46fe4a39-feb4-7b8b-97b9-0187d49a46bd/19UMGIM53914.rgb.jpg/1200x1200bf-60.jpg",
  },
];

const GridItems = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {albums.map((album, index) => (
        <div
          key={index}
          className="relative rounded-md bg-zinc-900 hover:bg-zinc-700 overflow-hidden"
        >
          <img
            src={album.cover}
            alt={album.title}
            className="w-20 h-20 object-cover"
          />
          <div className="absolute top-6 left-20  text-white p-2 text-sm">
            {album.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridItems;
