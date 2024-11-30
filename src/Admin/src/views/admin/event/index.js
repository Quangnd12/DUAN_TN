import React from "react";
import EventList from "./component/list"

const Events = () => {
    return (
        <div className="flex flex-wrap ">
            <div className="w-full mb-12 px-4">
            <EventList/>
            </div>                  
        </div>
    )
}

export default Events;