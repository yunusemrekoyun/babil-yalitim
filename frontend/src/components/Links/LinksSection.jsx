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

const LinksSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollRef = useRef(null);

  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // 🔹 Sayfa yüklenince "Projeler" ortada başlasın
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 2. kartın (index 1) offset'ini hesapla
    const card = el.children[1]; // Projeler kartı
    if (card) {
      const offset = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      el.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="w-full flex justify-center mt-6 px-0 sm:px-4 relative">
      {/* Oklar */}
      <button
        onClick={() => handleScroll("left")}
        className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/70 shadow active:scale-95"
        aria-label="Önceki"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => handleScroll("right")}
        className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/70 shadow active:scale-95"
        aria-label="Sonraki"
      >
        <ChevronRight size={18} />
      </button>

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