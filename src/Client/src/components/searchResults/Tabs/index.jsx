import React,{useState} from "react";
import PlaylistPublicInfo from "./PlaylistPublic";
import ListSongOfPublicPlaylist from "./ListSongOfPublicPlaylist";

const PlaylistListPublic = () => {

  return (
    <div className="relative w-full h-auto overflow-hidden">
      <PlaylistPublicInfo />
      <div className="relative text-left">
        <div className="p-4 bg-zinc-900 p-4 rounded-md  mt-4 backdrop-filter">
          <ListSongOfPublicPlaylist/>
        </div>
      </div>
    </div>
  );
};

export default PlaylistListPublic;
