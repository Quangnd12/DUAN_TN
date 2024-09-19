import React from "react";
import ArtistInfo from "./components/ArtistInfo";
import Playlist from "./sections/Artist";
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Artist = () => {
  return (
    <HelmetProvider>
    <div className="relative w-full h-screen">
       <Helmet>
          <title>Artist</title>
          <meta name="description" content="" />
        </Helmet>
      <ArtistInfo />
      <div className="relative text-left">
        <Playlist />
      </div>
    </div>
    </HelmetProvider>
  );
};

export default Artist;
