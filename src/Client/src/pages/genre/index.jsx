import React from "react";
import GenresList from "./sections/genre";
import GenreInfo from "./components/GenreInfo";
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Genres = () => {
  return (
    <HelmetProvider>
    <div className="relative w-full h-screen">
       <Helmet>
          <title>Album</title>
          <meta name="description" content="" />
        </Helmet>
      <GenreInfo />
      <div className="relative text-left">
        <GenresList/>
      </div>
    </div>
    </HelmetProvider>
  );
};

export default Genres;
