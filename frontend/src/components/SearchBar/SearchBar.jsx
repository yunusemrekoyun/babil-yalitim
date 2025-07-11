import React from "react";

const SearchBar = () => {
  return (
    <div className="flex justify-center w-full">
      <input
        type="text"
        placeholder="Nasıl Yardımcı Olabiliriz ? "
        className="bg-white border border-gray-300 rounded-full px-10 py-3 text-brandDark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-quaternaryColor focus:border-quaternaryColor hover:shadow-lg shadow transition text-lg drop-shadow-sm w-full max-w-4xl"
      />
    </div>
  );
};

export default SearchBar; 