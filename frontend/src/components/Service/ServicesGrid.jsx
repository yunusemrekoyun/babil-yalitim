// src/components/Service/ServiceGrid.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api";
import ServiceGridItem from "./ServiceGridItem";

const ServiceGrid = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  const videoRefs = useRef({});
  const scrollRef = useRef(null);

  // fetch
  useEffect(() => {
    api
      .get("/services")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Hizmet verileri alınamadı:", err));
  }, []);

  // responsive flag
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const len = items.length;
  const getIndex = (o) => (!len ? 0 : (currentIndex + o + len) % len);

  // desktop/tablet için görünür slotlar
  const visibleSlots = useMemo(() => {
    if (!len) return [];
    return [
      { slot: "prev2", index: getIndex(-2) },
      { slot: "prev1", index: getIndex(-1) },
      { slot: "center", index: getIndex(0) },
      { slot: "next1", index: getIndex(1) },
      { slot: "next2", index: getIndex(2) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, len]);

  // desktop hedefleri
  const slotTargets = (slot) => {
    const map = {
      prev2: { x: -360, scale: 0.78, opacity: 0.55, z: 5, blur: 2 },
      prev1: { x: -200, scale: 0.9, opacity: 0.75, z: 8, blur: 1.5 },
      center: { x: 0, scale: 1.0, opacity: 1.0, z: 10, blur: 0 },
      next1: { x: 200, scale: 0.9, opacity: 0.75, z: 8, blur: 1.5 },
      next2: { x: 360, scale: 0.78, opacity: 0.55, z: 5, blur: 2 },
    };
    return map[slot] || map.center;
  };

  // yalnız merkezde video oynat
  const stopAllVideosExcept = (indexToPlay) => {
    Object.entries(videoRefs.current).forEach(([idxStr, vid]) => {
      const idx = Number(idxStr);
      if (!vid) return;
      try {
        if (idx === indexToPlay) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      } catch {
        console.error("Failed to play video");
      }
      vid.onended = () => {
        vid.currentTime = 0;
        vid.pause();
      };
    });
  };
  useEffect(() => {
    const id = setTimeout(() => stopAllVideosExcept(getIndex(0)), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, len]);

  // MOBİL: scroll ile index’i güncelle — slide genişliğini gerçek slide’dan ölç
  useEffect(() => {
    if (!isMobile) return;
    const el = scrollRef.current;
    if (!el) return;

    const getSlideW = () => {
      const slide = el.querySelector(".mobile-slide");
      return slide ? slide.clientWidth : el.clientWidth;
    };

    const onScroll = () => {
      const slideW = getSlideW();
      const i = Math.round(el.scrollLeft / Math.max(1, slideW));
      setCurrentIndex((i + len) % len);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile, len]);

  if (!len) return null;

  return (
    <section className="relative text-white py-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Hizmetlerimiz
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded" />
      </div>

      <div className="relative mx-auto max-w-7xl h-[68vh] sm:h-[520px]">
        {/* DESKTOP/TABLET: 5 slot + oklar (animasyonlar AYNEN duruyor) */}
        <div className="hidden sm:block relative w-full h-full">
          {/* Sol ok */}
          <button
            onClick={() => setCurrentIndex((p) => (p - 1 + len) % len)}
            className="absolute left-2 top-1/2 -translate-y-1/2
                       text-white/90 bg-black/35 hover:bg-black/45 border border-white/20
                       rounded-full p-2 z-[50] active:scale-95 transition"
            aria-label="Önceki"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Kartlar */}
          {visibleSlots.map(({ slot, index }) => {
            const t = slotTargets(slot);
            const key = items[index]?._id || index;
            return (
              <motion.div
                key={key}
                className="absolute rounded-2xl overflow-hidden will-change-transform"
                style={{ left: "50%", top: "50%", zIndex: t.z }}
                initial={false}
                animate={{
                  translateX: `calc(-50% + ${t.x}px)`,
                  translateY: "-50%",
                  scale: t.scale,
                  opacity: t.opacity,
                  filter: `blur(${t.blur}px)`,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceGridItem
                  item={items[index]}
                  isCenter={slot === "center"}
                  registerVideoRef={(el) => {
                    if (el) videoRefs.current[index] = el;
                    else delete videoRefs.current[index];
                  }}
                />
              </motion.div>
            );
          })}

          {/* Sağ ok */}
          <button
            onClick={() => setCurrentIndex((p) => (p + 1) % len)}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       text-white/90 bg-black/35 hover:bg-black/45 border border-white/20
                       rounded-full p-2 z-[50] active:scale-95 transition"
            aria-label="Sonraki"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* MOBİL: tek kart, full genişlik container; kart genişliği 88vw => yan karttan “peek” */}
        <div
          ref={scrollRef}
          className="sm:hidden relative w-full h-full overflow-x-auto no-scrollbar snap-x snap-mandatory px-3"
        >
          <div className="flex h-full gap-3">
            {items.map((item, i) => (
              <div
                key={item?._id || i}
                className="mobile-slide w-[88vw] shrink-0 snap-center flex items-start justify-center pt-2"
              >
                <ServiceGridItem
                  item={item}
                  isCenter={i === currentIndex}
                  registerVideoRef={(el) => {
                    if (el) videoRefs.current[i] = el;
                    else delete videoRefs.current[i];
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alttaki buton: DESKTOP'ta biraz DAHA AŞAĞIDA, MOBİLDE animasyonsuz */}
        {isMobile ? (
          <div className="absolute bottom-0 right-4 sm:bottom-[-8px] sm:right-6 z-[45]">
            <a
              href="/services"
              className="flex items-center gap-2 text-sm text-white bg-quaternaryColor px-4 py-2 rounded-full"
            >
              Tüm Hizmetleri Gör
              <ChevronRight size={16} />
            </a>
          </div>
        ) : (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="absolute sm:bottom-[-8px] right-4 sm:right-6 z-[45]"
          >
            <a
              href="/services"
              className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
               px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 
               transition-all duration-300"
            >
              Tüm Hizmetleri Gör
              <ChevronRight size={16} />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServiceGrid;
