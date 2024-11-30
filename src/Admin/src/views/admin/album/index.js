import React from "react";
import AlbumList from "./component/list";

const Albums = () => {
    return (
        <>
                <div className="flex flex-wrap">
                    <div className="w-full mb-12 px-4">
                        <AlbumList />
                    </div>                  
                </div>
        </>
    );
}
export default Albums;