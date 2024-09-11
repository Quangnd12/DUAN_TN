import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import StarRateIcon from "@mui/icons-material/StarRate";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import LanguageIcon from "@mui/icons-material/Language";
import Logo from "../../assets/images/logo.jpg";

const SideBar = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col gap-4 bg-zinc-900 p-2 rounded-md">
        <Link to={"/"}>
          <img width={50} height={50} src={Logo} alt="logo" />
        </Link>
        <Link to={"/search"}>
          <div className="flex items-center gap-2 hover:bg-gray-600 rounded py-2">
            <SearchIcon fontSize="large" sx={{ color: "white" }} />
            <div className="text-white font-bol">Search</div>
          </div>
        </Link>
        <Link to={"/"}>
          <div className="flex items-center gap-2 hover:bg-gray-600 rounded py-2">
            <HomeIcon fontSize="large" sx={{ color: "white" }} />
            <div className="text-white font-bold">Home</div>
          </div>
        </Link>
        <Link to={"/favorite"}>
          <div className="flex items-center gap-2 hover:bg-gray-600 rounded py-2">
            <FavoriteIcon fontSize="large" sx={{ color: "white" }} />
            <div className="text-white font-bold">Favorite</div>
          </div>
        </Link>
        <Link to={"/library"}>
          <div className="flex items-center gap-2 hover:bg-gray-600 rounded py-2">
            <LibraryMusicIcon fontSize="large" sx={{ color: "white" }} />
            <div className="text-white font-bold">Your library</div>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-4 bg-zinc-900 p-2 rounded-md">
        <Link to={"/track"}>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded py-2">
            <QueueMusicIcon fontSize="large" sx={{ color: "white" }} />
            <div className="text-white font-bold">Playlist</div>
          </div>
        </Link>
        <Link to={"/top-rank"}>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded py-2">
            <StarRateIcon fontSize="large" sx={{ color: "white" }} />
            <div className="text-white font-bold">Top rank</div>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-2 bg-zinc-900 p-4 py-8 rounded-md">
        <div className="text-white font-bold p-3">
          Pay the fat together <br />
          and get lost in the <br />
          music
        </div>
        <div
          className="flex items-center gap-3 rounded-full w-max p-2 text-white font-bold bg-black hover:scale-105 cursor-pointer transition-all"
          style={{ border: "1px solid white" }}
        >
          <LanguageIcon />
          <span className="ml-0">English</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
