import React, { useState } from "react";
import { Play, Clock, MapPin, Share2, Heart, Calendar, ChevronDown, Music2 } from "lucide-react";

const MusicEventDetail = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-black to-black text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Music Events</h1>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                Music Heals
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold">Event Title</h1>
            <p className="text-xl text-gray-300">Artist Name</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex space-x-12">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            {/* Event Info */}
            <div className="bg-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">About the Event</h2>
              <p className="text-gray-300 leading-relaxed">
                Event description goes here.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Calendar className="w-5 h-5" />
                    <span>Date</span>
                  </div>
                  <p>Event Date</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Clock className="w-5 h-5" />
                    <span>Time</span>
                  </div>
                  <p>Event Time</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <MapPin className="w-5 h-5" />
                    <span>Location</span>
                  </div>
                  <p>Event Location</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-8">
            {/* Ticket Link */}
            <div className="bg-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Get Your Tickets!</h2>
              <a 
                href="https://example.com/tickets" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-center py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Buy Tickets Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Showcase */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Featured Artist</h2>
              <p className="text-gray-300">
                Featured artist description goes here.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/api/placeholder/400/400" 
                alt="Artist" 
                className="w-full h-[400px] object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicEventDetail;
