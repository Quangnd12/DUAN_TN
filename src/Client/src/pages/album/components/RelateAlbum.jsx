import React from "react";
import { Link } from "react-router-dom";
import data from "../../../data/fetchSongData";

const AlbumRandom = () => {

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-white font-bold mb-4">You may also like</h2>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.albums.slice(0, 5).map((album, index) => (
          <Link to={`/listalbum/${album.id}`} key={album.id}>
            <div
              className="flex flex-col items-start"
            >
              <img
                src={album.image}
                alt={album.name}
                className="w-52 h-52 object-cover rounded-lg"
              />
              <div className="mt-2 text-left">
                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[200px]">{album.name}</p>
                <p className="text-gray-400">{album.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumRandom;
