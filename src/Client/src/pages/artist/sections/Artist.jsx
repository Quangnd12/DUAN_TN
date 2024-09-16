import React from "react";
import PopularSong from "../component/List";
import ArtistAlbum from "../component/albums";
import Artist from "../component/RelatedArtists";

const Playlist = () => {
  return (
    <div className="p-4  bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <PopularSong />
        <ArtistAlbum />
        <Artist />
      </div>
    </div>
  );
};

export default Playlist;
