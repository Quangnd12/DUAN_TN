import React from "react";
import ArtistCover from "../../components/artist/ArtistCover";
import ArtistInfo from "../../components/artist/ArtistInfo";
import Playlist from "./playlist/Playlist";

const Artist = () => {
  return (
    <div className="relative w-full h-screen">
      <ArtistCover />
      <ArtistInfo />
      <div className="relative text-left">
        <Playlist />
      </div>
    </div>
  );
};

export default Artist;
