import React from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ShowAllListAlbums from "./components/show-all-album";

const LayoutAlbums = () => {
  return (
    <HelmetProvider>
      <div className="relative w-full h-auto overflow-hidden"> 
        <Helmet>
          <title>Album</title>
          <meta name="description" content="" />
        </Helmet>
        <div className="relative text-left">
          <ShowAllListAlbums />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LayoutAlbums;
