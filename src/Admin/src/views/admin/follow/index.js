import React from "react";
import FollowList from "./component/list";

const Follows = () => {
    return (
        <div className="pt-10"> 
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
             <FollowList/>
            </div>                  
        </div>
    </div>
    )
}

export default Follows;