// src/components/Service/ServiceGrid.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api";
import ServiceGridItem from "./ServiceGridItem";

const ServiceGrid = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef({});

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Hizmet verileri alınamadı:", err));
  }, []);

  const len = items.length;
  const getIndex = (o) => (!len ? 0 : (currentIndex + o + len) % len);

  const visibleSlots = useMemo(
    () =>
      len === 0
        ? []
        : [
            { slot: "prev2", index: getIndex(-2) },
            { slot: "prev1", index: getIndex(-1) },
            { slot: "center", index: getIndex(0) },
            { slot: "next1", index: getIndex(1) },
            { slot: "next2", index: getIndex(2) },
          ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, len]
  );

  // hedef konum/ölçek/opacity/blur/z
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

  // yalnız merkezdeki video oynasın
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
        console.error("Video oynatılırken hata olustu");
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

  if (!len) return null;

  return (
    <section className="relative text-white py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Hizmetlerimiz
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded" />
      </div>

      <div className="relative mx-auto max-w-7xl h-[520px]">
        {/* Sol ok */}
        <button
          onClick={() => setCurrentIndex((p) => (p - 1 + len) % len)}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white/90 bg-black/35 hover:bg-black/45 border border-white/20 rounded-full p-2 z-[50] active:scale-95 transition"
          aria-label="Önceki"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Saha */}
        <div className="relative w-full h-full">
          {visibleSlots.map(({ slot, index }) => {
            const t = slotTargets(slot);
            const key = items[index]?._id || index;

            return (
              <motion.div
                key={key}
                className="absolute rounded-xl overflow-hidden will-change-transform"
                // merkeze sabitle
                style={{ left: "50%", top: "50%", zIndex: t.z }}
                initial={false}
                // framer tüm transformu yazdığı için translateY'yi de burada sabitliyoruz
                animate={{
                  // -50% + x px ile yatay konum
                  translateX: `calc(-50% + ${t.x}px)`,
                  // dikeyde her zaman merkeze pinle
                  translateY: "-50%",
                  scale: t.scale,
                  opacity: t.opacity,
                  filter: `blur(${t.blur}px)`,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1], // smooth
                }}
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
        </div>

        {/* Sağ ok */}
        <button
          onClick={() => setCurrentIndex((p) => (p + 1) % len)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/90 bg-black/35 hover:bg-black/45 border border-white/20 rounded-full p-2 z-[50] active:scale-95 transition"
          aria-label="Sonraki"
        >
          <ChevronRight size={24} />
        </button>

        {/* CTA — biraz daha aşağı */}
        <a
          href="/services"
          className="absolute -bottom-6 md:-bottom-7 right-6 z-[45] flex items-center gap-2 text-sm text-white bg-quaternaryColor px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all"
        >
          Hizmetlerin detayları için…
          <ChevronRight size={16} />
        </a>
      </div>
    </section>
  );
};

export default ServiceGrid;
