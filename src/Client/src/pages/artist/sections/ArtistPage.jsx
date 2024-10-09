import React from "react";
import PopularSong from "../components/Artist";
import ArtistAlbum from "../components/ArtistAlbum";
import RelatedArtist from "../components/RelatedArtists";

const ArtistPage = () => {
  return (
    <div className="p-4 bg-zinc-900 p-4 rounded-md  mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <PopularSong />
        <ArtistAlbum />
        <RelatedArtist />
      </div>
    </div>
  );
};

export default ArtistPage;
