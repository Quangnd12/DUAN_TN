import React from "react";
import { Link } from "react-router-dom";


const CircleCard = ({ image, name, title }) => {


  return (
    <div
      className="hover:bg-gray-500 cursor-pointer transition-all rounded-md p-2 relative"
    >
      <div className="w-100">
          <div className="w-100" style={{ width: "150px", height: "150px" }}>
            <img
              className="rounded-full overflow-hidden"
              style={{ width: "100%", height: "100%" }}
              src={image}
              alt={name}
            />
          </div>
       
      </div>
      <div className="text-center text-white font-bold truncate overflow-hidden whitespace-nowrap">
        {name}
      </div>
      <div className="text-center text-white">{title}</div>
    </div>
  );
};

export default CircleCard;
