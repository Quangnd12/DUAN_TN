import React from "react";
import { Eye, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const EventCard = ({ 
  date, 
  location, 
  title, 
  description, 
  image, 
  onReadMore, 
  status, 
  category 
}) => {
  // Strip HTML tags from description
  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const cleanDescription = stripHtml(description);

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col"
    >
      {/* Image Section with Status Overlay */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span 
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === 'upcoming' ? 'bg-green-500/80 text-white' : 
              status === 'ongoing' ? 'bg-blue-500/80 text-white' : 
              'bg-gray-500/80 text-white'
            }`}
          >
            {status}
          </span>
          <span className="px-3 py-1 bg-purple-500/80 rounded-full text-white text-xs">
            {category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Event Details */}
        <div className="flex justify-between text-white/70 text-sm mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm mb-6 line-clamp-3">
          {cleanDescription}
        </p>

        {/* Read More Button */}
        <div className="mt-auto">
          <button 
            onClick={onReadMore}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            <Eye className="w-5 h-5" />
            <span>Read More</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;