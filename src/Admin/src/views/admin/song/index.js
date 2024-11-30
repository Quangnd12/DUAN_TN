import React from "react";

// components

import SongList from "./component/list";

const Songs = () => {
    return (
        <>
                <div className="flex flex-wrap">
                    <div className="w-full mb-12 px-4">
                        <SongList />
                    </div>                  
                </div>
        </>
    );
}
export default Songs