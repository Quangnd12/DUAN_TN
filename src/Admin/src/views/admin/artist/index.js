import React from "react";

// components

import ArtistList from "./component/list";

const Artists = () => {
    return (
        <>
            <div className="pt-16"> 
                <div className="flex flex-wrap mt-4">
                    <div className="w-full mb-12 px-4">
                        <ArtistList />
                    </div>                  
                </div>
            </div>
        </>
    );
}
export default Artists