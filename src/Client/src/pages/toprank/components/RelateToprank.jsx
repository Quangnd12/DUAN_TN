import React from "react";
import { Link } from "react-router-dom";

import data from "../../../data/fetchSongData";

const ToprankRamdom = () => {

  return (
    <div className="p-4 ">
      <div className="flex  justify-between items-center mb-4">
        <h2 className="text-2xl text-white font-bold mb-4">You may also like</h2>
      </div>
      <div className="grid  grid-cols-5 gap-4 ">
        {data.playlists.slice(0, 5).map((playlist, index) => (
          <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
            <div
              className="flex flex-col items-start"
            >
              <img
                src={playlist.image}
                alt={playlist.name}
                className="w-52 h-52 object-cover rounded-lg"
              />
              <div className="mt-2 text-left">
                <p className="text-white font-semibold">{playlist.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToprankRamdom;
