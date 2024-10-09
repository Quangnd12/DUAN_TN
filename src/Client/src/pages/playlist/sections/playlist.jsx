import React from "react";
import PlaylistFavorite from "../components/PlaylistFavorite";
import ListSongOfPlaylist from "../components/PlaylistList";
import PlaylistRandom from "../components/RelatedPlaylist";

const PlaylistList = () => {
  return (
    <div className="p-4 bg-zinc-900 p-4 rounded-md  mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ListSongOfPlaylist />
        <PlaylistFavorite/>
        <PlaylistRandom />
      </div>
    </div>
  );
};

export default PlaylistList;
