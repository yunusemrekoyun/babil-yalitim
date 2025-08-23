// src/components/Links/LinksSection.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "../../assets/services.jpg";
import img2 from "../../assets/projects.jpg";
import img3 from "../../assets/brands.jpg";
import LinkItem from "./LinkItem";

const links = [
  {
    label: "Hizmetler",
    img: img1,
    color: "text-secondaryColor",
    desc: "Hizmetlerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.",
    href: "/services",
  },
  {
    label: "Projeler",
    img: img2,
    color: "text-quaternaryColor",
    desc: "Projelerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.",
    href: "/projects",
  },
  {
    label: "Bloglar",
    img: img3,
    color: "text-brandBlue",
    desc: "Sizler için yayınladığımız içerikleri görmek için tıklayın.",
    href: "/blog",
  },
];

// 👉 Okları tamamen kaldırmak istersen bunu false yap.
const SHOW_ARROWS_MOBILE = true;

const LinksSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const scrollRef = useRef(null);

  const updateArrowState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  };

  const clampScroll = (left) => {
    const el = scrollRef.current;
    if (!el) return 0;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    return Math.min(max, Math.max(0, left));
  };

  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    const target =
      dir === "left"
        ? clampScroll(el.scrollLeft - amount)
        : clampScroll(el.scrollLeft + amount);

    // Eğer zaten uçtaysa hareket etme
    if (target === el.scrollLeft) return;

    el.scrollTo({ left: target, behavior: "smooth" });

    // smooth bitince state’i güncelle (yaklaşık)
    window.setTimeout(updateArrowState, 320);
  };

  // “Projeler” (index 1) ortada başlasın
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.children[1]; // Projeler kartı
    if (card) {
      const offset = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      el.scrollLeft = clampScroll(offset);
    }
    updateArrowState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll ve resize’ta butonları güncelle
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateArrowState();
    const onResize = () => updateArrowState();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="w-full flex justify-center mt-6 px-0 sm:px-4 relative">
      {/* Oklar (sadece mobilde gösteriliyor) */}
      {SHOW_ARROWS_MOBILE && (
        <>
          <button
            onClick={() => handleScroll("left")}
            disabled={!canLeft}
            className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/70 shadow active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Önceki"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={!canRight}
            className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/70 shadow active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Sonraki"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Kartlar */}
      <div
        ref={scrollRef}
        className="
          w-full max-w-none sm:max-w-screen-xl
          flex sm:flex-wrap justify-start sm:justify-center items-end
          gap-5 sm:gap-8 md:gap-10
          overflow-x-auto sm:overflow-visible no-scrollbar scroll-smooth snap-x snap-mandatory
          px-4 sm:px-0
        "
      >
        {links.map((link, idx) => (
          <div
            key={link.label}
            className="snap-center flex-shrink-0 w-[85%] mx-auto sm:w-auto sm:mx-0"
          >
            <LinkItem
              label={link.label}
              img={link.img}
              color={link.color}
              desc={link.desc}
              href={link.href}
              isHovered={hoveredIndex === idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksSection;
