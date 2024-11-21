import React from "react";
import GenresList from "./sections/genre";
import GenreInfo from "./components/GenreInfo";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useParams } from "react-router-dom";

const Genres = () => {
const {id}=useParams();

  return (
    <HelmetProvider>
    <div className="relative w-full h-screen">
       <Helmet>
          <title>Album</title>
          <meta name="description" content="" />
        </Helmet>
      <GenreInfo id={id}/>
      <div className="relative text-left">
        <GenresList />
      </div>
    </div>
    </HelmetProvider>
  );
};

export default Genres;
