import React from "react";
import ListSongOfAlbums from "../component/AlbumList";
import AlbumRandom from "../component/RelatedAlbum";

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
