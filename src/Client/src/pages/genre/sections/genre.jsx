import React from "react";
import ListSongOfGenres from "../components/GenreList";
// import AlbumRandom from "../components/RelateAlbum";

const GenresList = () => {
  return (
    <div className="p-4  bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ListSongOfGenres />
        {/* <AlbumRandom /> */}
      </div>
    </div>
  );
};

export default GenresList;
