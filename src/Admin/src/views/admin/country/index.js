import React from "react";
import CountryList from "./component/list";


const Countries = () => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-4">
             <CountryList/>
            </div>                  
        </div>
    )
}

export default Countries;