import React,{useState} from "react";
import YourPlayList from "./YourPlaylist";
import AddPlayListInfo from "./addInfoPlaylist";


const AddPlaylist = () => {

  const [playlistAdd, setPlaylistAdd] = useState([]);

  const handleAddSong = (song) => {
    setPlaylistAdd((prevPlaylist) => [...prevPlaylist, song]);
  };

  return (
    <div className="relative w-full h-auto overflow-hidden">
      <AddPlayListInfo />
      <div className="relative text-left">
        <div className="p-4 bg-zinc-900 p-4 rounded-md  mt-4 backdrop-filter">
          <YourPlayList playlistAdd={playlistAdd} />
        </div>
        {/* <RelatedSong onAddSong={handleAddSong} /> */}
      </div>
    </div>
  );
};

export default AddPlaylist;
