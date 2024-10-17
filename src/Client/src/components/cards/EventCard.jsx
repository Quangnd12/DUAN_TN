import React from "react";
import '../../assets/css/event/event.css';

const EventCard = ({ date, location, title, description, image, onReadMore }) => (
    <div className="bg-zinc-900 rounded-lg overflow-hidden p-6 text-white flex flex-col justify-between h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="space-y-4">
        {/* Thông tin ngày tháng và địa điểm */}
        <div className="flex justify-between text-gray-400 text-sm tracking-wide">
          <span>WHEN: {date}</span>
          <span>WHERE: {location}</span>
        </div>
        
        {/* Hình ảnh sự kiện */}
        <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden bg-orange-500 mb-4 transition-transform duration-300 hover:scale-110">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        
        {/* Tiêu đề sự kiện */}
        <h3 className="text-2xl font-semibold tracking-tight leading-snug">
          {title}
        </h3>
        
        {/* Mô tả sự kiện */}
        <p className="text-base text-gray-300 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      
      {/* Nút bấm */}
      <div className="flex justify-center mt-6"> 
        <button 
          onClick={onReadMore}
          className="custom-button px-4 py-1.5 border border-white/20 rounded-full hover:bg-blue-500 transition duration-300 transform hover:-translate-y-1 text-sm font-medium tracking-wide"
        >
          Read more
        </button>
      </div>
    </div>
);

export default EventCard;
