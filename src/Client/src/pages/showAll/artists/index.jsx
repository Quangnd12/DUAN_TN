import React from "react";

import { Helmet, HelmetProvider } from 'react-helmet-async';
import ShowAllArtist from "./components/show-all-artist";

const LayoutArtist = () => {
  return (
    <HelmetProvider>
    <div className="relative w-full h-auto overflow-hidden"> 
       <Helmet>
          <title>Artist</title>
          <meta name="description" content="" />
        </Helmet>  
      <div className="relative text-left">
        <ShowAllArtist />
      </div>    
    </div>
    </HelmetProvider>
  );
};

export default LayoutArtist;
