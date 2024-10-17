import React from "react";
import FavoriteList from "./component/list";

const Favorites = () => {
    return (
        <div className="pt-10"> 
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
             <FavoriteList/>
            </div>                  
        </div>
    </div>
    )
}

export default Favorites;