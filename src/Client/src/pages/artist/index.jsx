import React from "react";
import ArtistInfo from "./components/ArtistInfo";
import ArtistPage from "./sections/ArtistPage";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from "react-router-dom";

const Artist = () => {
  return (
    <HelmetProvider>
    <div className="relative w-full h-auto overflow-hidden"> 
       <Helmet>
          <title>Artist</title>
          <meta name="description" content="" />
        </Helmet>  
      <ArtistInfo />
      <div className="relative text-left">
        <ArtistPage />
      </div>    
    </div>
    </HelmetProvider>
  );
};

export default Artist;
