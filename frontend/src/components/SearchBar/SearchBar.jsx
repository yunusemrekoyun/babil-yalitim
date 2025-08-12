// src/components/SearchBar/SearchBar.jsx
import { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const normalizeTypeToPath = (type = "", id = "") => {
  const t = String(type).toLowerCase();
  if (!id) return null;

  // blog / blogs
  if (t.startsWith("blog")) return `/blog/${id}`;
  // journal / journals / news
  if (t.startsWith("journal") || t.startsWith("news")) return `/journals/${id}`;
  // project / projects
  if (t.startsWith("project")) return `/project-detail/${id}`;
  // service / services
  if (t.startsWith("service")) return `/services/${id}`;

  return null; // bilinmeyen tip
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // [{_id, title, type}, ...]
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Debounced fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHighlightIndex(-1);
      return;
    }

    const t = setTimeout(() => {
      api
        .get(`/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          const arr = Array.isArray(res.data) ? res.data : [];
          setResults(arr);
          setHighlightIndex(arr.length ? 0 : -1);
        })
        .catch((err) => console.error("Arama hatası:", err));
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  // Dış tıklamada kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults([]);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const go = (item) => {
    const id = item?._id || item?.id || item?.slug;
    const path = normalizeTypeToPath(item?.type, id);
    if (path) {
      navigate(path);
    } else {
      console.warn("Bilinmeyen arama tipi, yönlendirilemiyor:", item);
    }
    setQuery("");
    setResults([]);
    setHighlightIndex(-1);
  };

  // Klavye ile gezinme
  const onKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = highlightIndex >= 0 ? results[highlightIndex] : results[0];
      if (item) go(item);
    } else if (e.key === "Escape") {
      setResults([]);
      setHighlightIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-[9999]">
      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="Nasıl yardımcı olabiliriz?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="bg-white border border-gray-300 rounded-full px-10 py-3 text-brandDark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-quaternaryColor focus:border-quaternaryColor hover:shadow-lg shadow transition text-lg drop-shadow-sm w-full"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls="global-search-results"
          />
          <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {results.length > 0 && (
        <ul
          id="global-search-results"
          className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-4xl left-1/2 -translate-x-1/2 max-h-72 overflow-y-auto z-[9999]"
          role="listbox"
        >
          {results.map((item, idx) => {
            const active = idx === highlightIndex;
            return (
              <li
                key={item._id || idx}
                role="option"
                aria-selected={active}
                // onClick yerine onMouseDown: input blur olmadan çalışsın
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(item);
                }}
                className={`px-6 py-3 cursor-pointer text-brandDark text-sm flex justify-between items-center transition ${
                  active ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="line-clamp-1">{item.title}</span>
                <span className="text-gray-400 text-xs">
                  ({String(item.type || "").toLowerCase()})
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
