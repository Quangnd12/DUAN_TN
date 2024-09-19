import React from "react";
import ListSongOfAlbums from "../components/AlbumList";
import AlbumRandom from "../components/RelateAlbum";

const AlbumsList = () => {
  return (
    <div className="p-4  bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ListSongOfAlbums />
        <AlbumRandom />
      </div>
    </div>
  );
};

export default AlbumsList;
