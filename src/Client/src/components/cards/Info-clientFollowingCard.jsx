import React, { useEffect } from "react";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import slugify from "slugify";

const InfoClientFollowingCard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const { data, error, isLoading, refetch } = useGetUserFollowedArtistsQuery(
    undefined,
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true
    }
  );

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  if (isLoading) return (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 py-4">
      Error fetching followed artists
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Following</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5">
        {data && data.map((artist) => (
          <div
            key={artist.id}
            className="group relative flex flex-col items-center"
          >
            <Link 
              to={`/artist/${slugify(artist.name)}`}
              className="relative block w-32 h-32 mb-3 overflow-hidden rounded-full
                transition-transform duration-300 hover:scale-105"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-300 
                  group-hover:scale-110"
                src={artist.avatar}
                alt={`${artist.name}'s avatar`}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to={`/artist/${slugify(artist.name)}`}
              className="text-center"
            >
              <h3 className="text-white font-medium text-base mb-1 
                hover:text-blue-500 transition-colors">
                {artist.name}
              </h3>
              <p className="text-gray-400 text-sm">Artist</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoClientFollowingCard;
