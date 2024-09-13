import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`flex items-center w-64 rounded-md p-2 transition-colors duration-300 border ${
        isFocused
          ? "bg-white text-black border-white"
          : "bg-gray-700 text-white hover:bg-gray-500 border-transparent"
      }`}
    >
      <FaSearch className="ml-2" />
      <input
        type="text"
        placeholder="What do you want to play?..."
        className={`bg-transparent border-none outline-none ml-2 w-full ${
          isFocused ? "placeholder-black" : "placeholder-gray-400"
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchInput;
