import React from "react";
import AlbumsList from "./sections/album";
import AlbumInfo from "./components/AlbumInfo";
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Albums = () => {
  return (
    <HelmetProvider>
    <div className="relative w-full h-auto overflow-hidden">
       <Helmet>
          <title>Album</title>
          <meta name="description" content="" />
        </Helmet>
      <AlbumInfo />
      <div className="relative text-left">
        <AlbumsList/>
      </div>
    </div>
    </HelmetProvider>
  );
};

export default Albums;
