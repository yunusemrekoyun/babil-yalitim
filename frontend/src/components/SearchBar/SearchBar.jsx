// src/components/SearchBar/SearchBar.jsx
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const normalizeTypeToPath = (type = "", id = "") => {
  const t = String(type).toLowerCase();
  if (!id) return null;
  if (t.startsWith("blog")) return `/blog/${id}`;
  if (t.startsWith("journal") || t.startsWith("news")) return `/journals/${id}`;
  if (t.startsWith("project")) return `/project-detail/${id}`;
  if (t.startsWith("service")) return `/services/${id}`;
  return null;
};

const typeLabelMap = {
  blog: "Blog",
  blogs: "Blog",
  journal: "Haberler",
  journals: "Haberler",
  news: "Haberler",
  project: "Projeler",
  projects: "Projeler",
  "project-detail": "Projeler",
  service: "Hizmetler",
  services: "Hizmetler",
  about: "Hakkımızda",
  whyus: "Neden Biz?",
  contact: "İletişim",
  iletisim: "İletişim",
  kvkk: "KVKK",
};

const getTypeLabel = (item = {}) => {
  const t = String(item.type || "").toLowerCase();
  if (t && typeLabelMap[t]) return typeLabelMap[t];
  const path = String(item.path || item.pathname || "");
  if (path.startsWith("/")) {
    const seg = path.split("/")[1] || "";
    if (typeLabelMap[seg]) return typeLabelMap[seg];
    if (seg === "project-detail") return "Projeler";
  }
  return "Diğer";
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState(null); // {left, top, width}
  const navigate = useNavigate();

  const containerRef = useRef(null); // input alanı (anchor)
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Dropdown pozisyonunu hesapla
  const updateDropdownPos = () => {
    const anchor = containerRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const GAP = 8; // input altına 8px boşluk
    setDropdownPos({
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY + GAP,
      width: rect.width,
    });
  };

  useEffect(() => {
    // results açıldığında ölç
    if (results.length) updateDropdownPos();
  }, [results.length]);

  useEffect(() => {
    // resize/scroll’da yeniden ölç
    const onResize = () => results.length && updateDropdownPos();
    const onScroll = () => results.length && updateDropdownPos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [results.length]);

  // Dış tıklamada kapat (portal içini de hesaba kat)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inAnchor = containerRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inAnchor && !inDropdown) {
        setResults([]);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const go = (item) => {
    const id = item?._id || item?.id || item?.slug;
    let path = normalizeTypeToPath(item?.type, id);
    if (!path && item?.path) path = item.path;
    if (path) navigate(path);
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
    <>
      {/* Anchor */}
      <div ref={containerRef} className="relative w-full">
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-4xl">
            <input
              ref={inputRef}
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
      </div>

      {/* Dropdown: PORTAL ile body'ye */}
      {results.length > 0 &&
        dropdownPos &&
        createPortal(
          <ul
            id="global-search-results"
            ref={dropdownRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto z-[99999]"
            style={{
              left: dropdownPos.left,
              top: dropdownPos.top,
              width: dropdownPos.width,
            }}
            role="listbox"
          >
            {results.map((item, idx) => {
              const active = idx === highlightIndex;
              return (
                <li
                  key={item._id || idx}
                  role="option"
                  aria-selected={active}
                  onMouseDown={(e) => {
                    e.preventDefault(); // blur olmadan çalışsın
                    go(item);
                  }}
                  className={`px-6 py-3 cursor-pointer text-brandDark text-sm flex justify-between items-center transition ${
                    active ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="line-clamp-1">{item.title}</span>
                  <span className="text-gray-400 text-xs">
                    ({getTypeLabel(item)})
                  </span>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </>
  );
};

export default SearchBar;
