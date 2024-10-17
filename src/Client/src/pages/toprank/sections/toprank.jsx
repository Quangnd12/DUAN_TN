import React from "react";
import ListSongOfToprank from "../components/ToprankList";
import ToprankRamdom from "../components/RelateToprank";

const ToprankList = () => {
  return (
    <div className="p-4 bg-gradient-to-t rounded-b-lg mt-4 backdrop-filter">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ListSongOfToprank />
        <ToprankRamdom/>
      </div>
    </div>
  );
};

export default ToprankList;
