import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllEventsQuery } from "../../../../redux/slice/eventSlice";
import { Loader2, AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import EventCard from '../../components/cards/EventCard';

const Event = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllEventsQuery({
    page: 1,
    limit: 12,
    status: null,
    sort: 'createdAt',
    order: 'DESC'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-black to-black">
        <div className="text-center">
          <Loader2 className="animate-spin text-white w-16 h-16 mx-auto mb-4" />
          <p className="text-white text-xl">Loading exciting events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-black to-black text-white p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300">Unable to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-black p-8">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-white text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center">
            <Sparkles className="w-10 h-10 mr-4 text-yellow-400" />
            Upcoming Events
            <TrendingUp className="w-8 h-8 ml-4 text-green-400" />
          </h1>
        </div>
        
        {data?.events?.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            No events found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data?.events?.map((event) => (
              <EventCard 
                key={event.id} 
                id={event.id}
                title={event.name} 
                date={new Date(event.startTime).toLocaleDateString()}
                location={event.location}
                image={event.coverUrl || "/api/placeholder/400/400"}
                description={event.description} 
                onReadMore={() => navigate(`/event/${event.id}`)}
                status={event.status}
                category={event.eventCategory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;