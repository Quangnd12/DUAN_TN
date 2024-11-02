import React from "react";
import EventList from "./component/list";

const Events = () => {
    return (
        <div className="pt-10"> 
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
               {/* {'import component list vào '} */}
               <EventList></EventList>
            </div>                  
        </div>
    </div>
    )
}

export default Events;