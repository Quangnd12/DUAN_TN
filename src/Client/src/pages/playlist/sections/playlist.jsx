import React from "react";
import ListSongOfPlaylist from "../component/PlaylistList";
import PlaylistRandom from "../component/RelatedPlaylist";

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
