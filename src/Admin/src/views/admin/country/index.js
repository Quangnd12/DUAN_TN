import React from "react";
import CountryList from "./component/list";


const Countries = () => {
    return (
        <div className="pt-10"> 
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
             <CountryList/>
            </div>                  
        </div>
    </div>
    )
}

export default Countries;