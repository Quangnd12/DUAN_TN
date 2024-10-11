import { createAlbumSlug } from "Client/src/components/createSlug";
import React from "react";
import { Link } from "react-router-dom";

import data from "../../../data/fetchSongData";

const PlaylistRandom = () => {

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-white font-bold mb-4">You may also like</h2>
      </div>
      <div className="grid grid-cols-6 gap-4 justify-items-center">
        {data.playlists.slice(0, 6).map((playlist, index) => (
          <Link to={`/playlist/${createAlbumSlug(playlist.name, playlist.title)}`} key={playlist.id}>
            <div
              className="flex flex-col items-start"
            >
              <img
                src={playlist.image}
                alt={playlist.name}
                className="w-[170px] h-[170px] object-cover rounded-md"
              />
              <div className="mt-2 text-left">
                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{playlist.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlaylistRandom;