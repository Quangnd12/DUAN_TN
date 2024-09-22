import React from "react";
import ListSongOfPlaylist from "../components/PlaylistList";
import PlaylistRandom from "../components/RelatedPlaylist";

const PlaylistList = () => {
  return (
    <div className="p-4  bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ListSongOfPlaylist />
        <PlaylistRandom />
      </div>
    </div>
  );
};

export default PlaylistList;
