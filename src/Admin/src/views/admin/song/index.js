import React from "react";

// components

import SongList from "./component/list";

const Songs = () => {
    return (
        <>
            <div className="pt-10"> 
                <div className="flex flex-wrap mt-4">
                    <div className="w-full mb-12 px-4">
                        <SongList />
                    </div>                  
                </div>
            </div>
        </>
    );
}
export default Songs