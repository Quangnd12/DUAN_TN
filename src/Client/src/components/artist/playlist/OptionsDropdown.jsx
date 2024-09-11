import React from "react";

const OptionsDropdown = ({ handleOptionFollowClick, isFollowing }) => {
  return (
    <div className="absolute right-0 mt-2 w-72 z-40 bg-zinc-800 text-white rounded-lg drop-shadow-2xl p-4">
      <p className="mb-2 font-bold whitespace-nowrap">
        More options for SOOBIN
      </p>
      <button
        onClick={handleOptionFollowClick}
        className="text-white p-2 w-full text-left hover:bg-gray-700"
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
      <button className="text-white p-2 w-full text-left hover:bg-gray-700">
        Go to artist radio
      </button>
    </div>
  );
};

export default OptionsDropdown;
