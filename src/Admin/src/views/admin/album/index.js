import React from "react";
import AlbumList from "./component/list";

const Albums = () => {
    return (
        <>
            <div className="pt-16"> 
                <div className="flex flex-wrap mt-4">
                    <div className="w-full mb-12 px-4">
                        <AlbumList />
                    </div>                  
                </div>
            </div>
        </>
    );
}
export default Albums;