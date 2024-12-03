import React from "react";

// components

import ArtistList from "./component/list";

const Artists = () => {
    return (
        <>
                <div className="flex flex-wrap ">
                    <div className="w-full mb-12 px-4">
                        <ArtistList />
                    </div>                  
                </div>
        </>
    );
}
export default Artists;