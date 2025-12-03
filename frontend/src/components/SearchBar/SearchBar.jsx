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
      setDropdownPos(null);
      return;
    }
    const t = setTimeout(() => {
      api
        .get(`/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          const arr = Array.isArray(res.data) ? res.data : [];
          setResults(arr);
          setHighlightIndex(arr.length ? 0 : -1);
          updateDropdownPos(); // veri geldikten sonra pozisyonu güncelle
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
    const GAP = 4; // input altına 4px boşluk (daha yakın dursun)
    setDropdownPos({
      left: rect.left,
      top: rect.bottom + GAP,
      width: rect.width,
    });
  };

  useEffect(() => {
    // resize: pozisyonu koru, scroll: dropdown'ı kapat (takılı kalmasın)
    const onResize = () => results.length && updateDropdownPos();
    const onScroll = () => {
      if (!results.length) return;
      setResults([]);
      setHighlightIndex(-1);
    };
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
            className="fixed z-[99999] max-h-80 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.4)] backdrop-blur-md"
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
                  className={`px-5 py-3 cursor-pointer text-brandDark text-sm flex justify-between items-center transition ${
                    active
                      ? "bg-slate-100/90"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="line-clamp-1 text-slate-800 text-sm font-medium">{item.title}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {item?.excerpt || item?.description || item?.content || ""}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0">
                    {getTypeLabel(item)}
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
