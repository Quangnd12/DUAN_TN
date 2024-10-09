import React from "react";
import ListSongOfAlbums from "../components/AlbumList";
import AlbumRandom from "../components/RelateAlbum";

const AlbumsList = () => {
  return (
    <div className="p-4 mt-4 text-white bg-zinc-900 p-4 rounded-md backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ListSongOfAlbums />
        <AlbumRandom />
      </div>
    </div>
  );
};

export default AlbumsList;
