import {createAlbumSlug} from "../../../components/createSlug";
import React from "react";
import { Link, useParams } from "react-router-dom";

import data from "../../../data/fetchSongData";

const ArtistAlbum = () => {

  const { artistName } = useParams();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-white font-bold mb-4">Albums</h2>
        <Link to={`/artist/${artistName}/album`} className="text-blue-400 hover:underline">
          Show All
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-4 justify-items-center">
        {data.albums.slice(0, 6).map((album, index) => (
          <Link to={`/album/${createAlbumSlug(album.name,album.title)}`} key={album.id}>
            <div
              className="flex flex-col items-start"
            >
              <img
                src={album.image}
                alt={album.name}
                className="w-[170px] h-[170px] object-cover rounded-md"
              />
              <div className="mt-2 text-left">
                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{album.name}</p>
                <p className="text-gray-400">
                  {`${new Date(album.date).getMonth() + 1}/${new Date(album.date).getFullYear()}`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbum;
