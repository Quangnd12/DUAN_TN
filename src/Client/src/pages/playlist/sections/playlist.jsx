import React,{useState} from "react";
import ListSongOfPlaylist from "../components/PlaylistList";
import RelatedSong from "../components/PlaylistAdd/RelatedSong";
import PlayListInfo from "../../playlist/components/PlaylistInfo";

const PlaylistList = () => {
  const [playlistAdd, setPlaylistAdd] = useState([]);

  const handleAddSong = (song) => {
    setPlaylistAdd((prevPlaylist) => [...prevPlaylist, song]);
  };

  return (
    <div className="relative w-full h-auto overflow-hidden">
      <PlayListInfo />
      <div className="relative text-left">
        <div className="p-4 bg-zinc-900 p-4 rounded-md  mt-4 backdrop-filter">
          <ListSongOfPlaylist playlistAdd={playlistAdd} />
        </div>
        {/* <RelatedSong onAddSong={handleAddSong} /> */}
      </div>
    </div>
  );
};

export default PlaylistList;


