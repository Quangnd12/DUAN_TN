import React from "react";
import ToprankInfo from "./components/ToprankInfo";
import TopRankSongList from "./components/TopRankSongList";

const TopRank = () => {
  return (
    <div className="relative w-full h-screen">
      <ToprankInfo />
      <div className="relative text-left">
        <TopRankSongList />
      </div>
    </div>
  );
};

export default TopRank;
