import React from "react";

const InfoClientFollowingCard = ({id, imageUrl,name }) => {
    return (
    
          
            <div
              key={id}
              className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <img
                className="w-40 h-40 rounded-full mb-2 object-cover transition-transform duration-300 hover:scale-110"
                src={imageUrl}
                alt="Avatar"
              />
              <span className="text-white block mb-2">{name}</span>
              <h6 className="text-gray-400">Profile</h6>
            </div>
       
      
    );
}
export default InfoClientFollowingCard;