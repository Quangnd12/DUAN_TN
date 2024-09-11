import React from "react";

const SquareCard = ({ image, name, title }) => {
  return (
    <div className="grid grid-cols-2 gap-4"> {/* Chia thành ba cột */} 
      <div className="relative w-98 h-32 overflow-hidden rounded-lg border border-gray-300"> {/* Thêm border */}
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-2">
          <div className="text-center">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-xs">{name}</p>
          </div>
        </div>
      </div>
     
     
    </div>
  );
};

export default SquareCard;
