import React from "react";

const SearchBar = () => {
  return (
    <div className="flex justify-center w-full">
      <input
        type="text"
        placeholder="Search..."
        className="bg-black/60 border border-white/20 rounded-full px-6 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brandDark/60 w-full max-w-md shadow-lg backdrop-blur-md"
      />
    </div>
  );
};

export default SearchBar; 