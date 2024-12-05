import React from "react";
import { useGetUserFollowedArtistsQuery } from "../../../../redux/slice/followSlice";

const InfoClientFollowingCard = () => {
  const { data, error, isLoading } = useGetUserFollowedArtistsQuery();

  if (isLoading) return <p>Loading followed artists...</p>;
  if (error) return <p>Error fetching followed artists</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {data && data.map((artist) => (
        <div
          key={artist.id}
          className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <img
            className="w-40 h-40 rounded-full mb-2 object-cover transition-transform duration-300 hover:scale-110"
            src={artist.avatar}
            alt={`${artist.name}'s avatar`}
          />
          <span className="text-white block mb-2">{artist.name}</span>
          <h6 className="text-gray-400">Profile</h6>
        </div>
      ))}
    </div>
  );
};

export default InfoClientFollowingCard;
