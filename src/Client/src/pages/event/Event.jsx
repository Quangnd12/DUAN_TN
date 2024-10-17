import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from '../../components/cards/EventCard';

const Event = () => {
  const navigate = useNavigate();
  const events = [
    {
      id: 1,
      title: "Poetry Night", 
      date: "15/07/2022",
      location: "Morocco Bound Bookshop",
      image: "/api/placeholder/400/400",
      description: "An intimate evening of Poetry and Spoken word at Morocco Bound!"
    },
    {
      id: 2,
      title: "Jazz in the City", 
      date: "15/07/2022",
      location: "TAM Vineyard & Jazz Club",
      image: "/api/placeholder/400/400",
      description: "TAM Presents Jazz in the City with OGG in Canary Wharf!"
    },
    {
      id: 3,
      title: "Private Mansion Concert", 
      date: "17/06/2022",
      location: "Private mansion at 64",
      image: "/api/placeholder/400/400",
      description: "This Jazz & Club event at the private mansion features Elida Almeida, a fantastic singer from Cape Verde"
    },
    {
      id: 4,
      title: "Jazz Night at TAM", 
      date: "15/07/2022",
      location: "TAM Vineyard & Jazz Club",
      image: "/api/placeholder/400/400",
      description: "TAM Presents Jazz in the City with OGG in Canary Wharf!"
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[90rem] mx-auto">
        <h1 className="text-white text-6xl font-bold mb-12">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              {...event} 
              onReadMore={() => navigate(`/event/${event.id}`)} // Thêm hàm onReadMore
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event;
