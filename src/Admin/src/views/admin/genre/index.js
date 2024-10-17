import React from "react";
import GenreList from "./component/list";

const Genres = () => {
    return (
        <div className="pt-10"> 
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
             <GenreList/>
            </div>                  
        </div>
    </div>
    )
}

export default Genres;