import React from "react";
import PlaylistList from "./sections/playlist";
import PlayListInfo from "./components/PlaylistInfo";

const Playlist = () => {
  return (
    <div className="relative w-full h-auto overflow-hidden">
      <PlayListInfo />
      <div className="relative text-left">
        <PlaylistList />
      </div>
    </div>
  );
};

export default Playlist;
