import React from "react";
import GenreList from "./component/list";

const Genres = () => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-4">
             <GenreList/>
            </div>                  
        </div>
    )
}

export default Genres;