// src/components/SearchBar/SearchBar.jsx
import React, { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Sorguya göre sonuçları getir
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      api
        .get(`/search?q=${query}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Arama hatası:", err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Dış tıklamada kapansın
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    navigate(`/${item.type}/${item._id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative w-full z-[9999]">
      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="Nasıl Yardımcı Olabiliriz ?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white border border-gray-300 rounded-full px-10 py-3 text-brandDark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-quaternaryColor focus:border-quaternaryColor hover:shadow-lg shadow transition text-lg drop-shadow-sm w-full"
          />
          <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {results.length > 0 && (
        <ul className="absolute top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto z-[9999]">
          {results.map((item) => (
            <li
              key={item._id}
              onClick={() => handleSelect(item)}
              className="px-6 py-3 hover:bg-gray-100 cursor-pointer text-brandDark text-sm flex justify-between items-center"
            >
              <span>{item.title}</span>
              <span className="text-gray-400 text-xs">({item.type})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;