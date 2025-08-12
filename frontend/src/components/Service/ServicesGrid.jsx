// src/components/Service/ServiceGrid.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api";
import ServiceGridItem from "./ServiceGridItem";

const ServiceGrid = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  // Sadece video kartlarını kontrol etmek için
  const videoRefs = useRef({}); // { [globalIndex]: HTMLVideoElement }

  useEffect(() => {
    const t = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data);
      })
      .catch((err) => console.error("Hizmet verileri alınamadı:", err));
  }, []);

  const len = items.length;
  const getIndex = (offset) => (!len ? 0 : (currentIndex + offset + len) % len);

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

  const slotClassMap = {
    prev2: "hidden md:block scale-75 blur-sm -translate-x-56 z-0 opacity-40",
    prev1: "scale-90 blur-sm -translate-x-28 z-10 opacity-70",
    center:
      "scale-100 blur-0 translate-x-0 z-20 opacity-100 drop-shadow-[0_18px_32px_rgba(0,0,0,0.25)]",
    next1: "scale-90 blur-sm translate-x-28 z-10 opacity-70",
    next2: "hidden md:block scale-75 blur-sm translate-x-56 z-0 opacity-40",
  };
  const getSlotClass = (slot) =>
    hasMounted ? slotClassMap[slot] : "opacity-0 scale-95";

  // Ortadaki karttaki video oynasın, diğerleri dursun
  const stopAllVideosExcept = (indexToPlay) => {
    Object.entries(videoRefs.current).forEach(([idxStr, vid]) => {
      const idx = Number(idxStr);
      if (!vid) return;
      try {
        if (idx === indexToPlay) {
          // güvene almak için başa sar + play
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      } catch {
        // sessiz
      } finally {
        vid.onended = () => {
          vid.currentTime = 0;
          vid.pause();
        };
      }
    });
  };

  // index değişince merkezdekini oynat
  useEffect(() => {
    // refs mount’u kaçırmamak için microtask
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

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentIndex((p) => (p - 1 + len) % len)}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-white/20 z-30"
          aria-label="Önceki"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="relative flex items-center justify-center w-full max-w-full md:max-w-7xl h-[500px]">
          {visibleSlots.map(({ slot, index }) => (
            <motion.div
              key={`${slot}-${items[index]?._id || index}`}
              className={`absolute transition-all duration-500 ease-in-out rounded-xl overflow-hidden ${getSlotClass(
                slot
              )}`}
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
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((p) => (p + 1) % len)}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-white/20 z-30"
          aria-label="Sonraki"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* sağ-alt CTA */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="absolute bottom-6 right-6 z-40"
      >
        <a
          href="/services"
          className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
            px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 
            transition-all duration-300"
        >
          Hizmetlerin detayları için…
          <ChevronRight size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default ServiceGrid;
