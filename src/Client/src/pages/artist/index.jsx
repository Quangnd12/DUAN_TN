import React from "react";
import ArtistInfo from "./component/ArtistInfo";
import Playlist from "./sections/Artist";

const Artist = () => {
  return (
    <div className="relative w-full h-screen">
      <ArtistInfo />
      <div className="relative text-left">
        <Playlist />
      </div>
    </div>
  );
};

export default Artist;
