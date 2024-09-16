import React from "react";
import AlbumsList from "./sections/album";
import AlbumInfo from "./component/AlbumInfo";

const Albums = () => {
  return (
    <div className="relative w-full h-screen">
      <AlbumInfo />
      <div className="relative text-left">
        <AlbumsList/>
      </div>
    </div>
  );
};

export default Albums;
