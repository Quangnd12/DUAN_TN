import React from "react";
import PlaylistControls from "../../../components/artist/playlist/PlaylistControls";
import PopularSongs from "../../../components/artist/playlist/PopularSongs";
import ArtistChoice from "../../../components/artist/playlist/ArtistChoice";

const Playlist = () => {
  return (
    <div className="p-4 bg-zinc-800 bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <PlaylistControls />
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <PopularSongs />
        <ArtistChoice />
      </div>
    </div>
  );
};

export default Playlist;
