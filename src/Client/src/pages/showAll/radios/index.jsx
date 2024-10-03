import React from "react";

import { Helmet, HelmetProvider } from 'react-helmet-async';
import ShowAllListRadio from "./components/show-all-radio";

const LayoutRadio = () => {
  return (
    <HelmetProvider>
    <div className="relative w-full h-auto overflow-hidden"> 
       <Helmet>
          <title>Radio</title>
          <meta name="description" content="" />
        </Helmet>  
      <div className="relative text-left">
        <ShowAllListRadio />
      </div>    
    </div>
    </HelmetProvider>
  );
};

export default LayoutRadio;
