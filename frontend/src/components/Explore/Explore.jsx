import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api"; // axios instance

const Explore = () => {
  const [items, setItems] = useState([]); // services
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  // Sadece videolar için ref tutuyoruz (img’ler için gerek yok)
  const videoRefs = useRef({}); // { [index]: HTMLVideoElement }

  useEffect(() => {
    const timeout = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        // Backend’den: title, description, imageDataUrl, galleryDataUrls
        const data = Array.isArray(res.data) ? res.data : [];
        // videoUrl var ise koru (eski içerik için), yoksa image göster
        setItems(data);
      })
      .catch((err) => {
        console.error("Hizmet verileri alınamadı:", err);
      });
  }, []);

  const len = items.length;

  const getIndex = (offset) => {
    if (!len) return 0;
    return (currentIndex + offset + len) % len;
  };

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
    [currentIndex, len]
  );

  const slotClassMap = {
    prev2: "hidden md:block scale-75 blur-sm -translate-x-56 z-0 opacity-40",
    prev1: "scale-90 blur-sm -translate-x-28 z-10 opacity-70",
    center: "scale-100 blur-0 translate-x-0 z-20 opacity-100",
    next1: "scale-90 blur-sm translate-x-28 z-10 opacity-70",
    next2: "hidden md:block scale-75 blur-sm translate-x-56 z-0 opacity-40",
  };

  const getSlotClass = (slot) =>
    hasMounted ? slotClassMap[slot] : "opacity-0 scale-95";

  const stopAllVideosExcept = (indexToPlay) => {
    // Sadece videoları kontrol et
    Object.entries(videoRefs.current).forEach(([idxStr, vid]) => {
      const idx = Number(idxStr);
      if (!vid) return;
      try {
        if (idx === indexToPlay) {
          vid.play().catch(() => {}); // autoplay engelinde hata yeme
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      } catch {console.error("Video play/pause hatası")}
      finally {
        vid.onended = () => {
          vid.currentTime = 0;
          vid.pause();
        };
      };
      
    });
  };

  useEffect(() => {
    stopAllVideosExcept(getIndex(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, len]);

  const next = () => {
    if (!len) return;
    setCurrentIndex((prev) => (prev + 1) % len);
  };

  const prev = () => {
    if (!len) return;
    setCurrentIndex((prev) => (prev - 1 + len) % len);
  };

  if (len === 0) return null; // yüklenene kadar render etme

  return (
    <section className="relative text-white py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Hizmetlerimiz
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded"></div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-white/20 z-30"
          aria-label="Önceki"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="relative flex items-center justify-center w-full max-w-full md:max-w-7xl h-[500px]">
          {visibleSlots.map(({ slot, index }) => {
            const it = items[index];
            const hasVideo = Boolean(it?.videoUrl); // eski veri desteği
            const coverSrc = hasVideo ? it.videoUrl : it?.imageDataUrl || "";
            return (
              <motion.div
                key={`${slot}-${index}`}
                className={`absolute transition-all duration-500 ease-in-out rounded-xl overflow-hidden ${getSlotClass(
                  slot
                )}`}
              >
                {hasVideo ? (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                      else delete videoRefs.current[index];
                    }}
                    src={coverSrc}
                    muted
                    loop
                    playsInline
                    className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
                  />
                ) : (
                  <img
                    src={coverSrc}
                    alt={it?.title || "service"}
                    className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
                    loading="lazy"
                  />
                )}

                {/* Orta kart overlay: başlık + (varsa) galeri thumbs */}
                {slot === "center" && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                    <p className="text-white text-lg font-semibold mb-3 text-center md:text-left">
                      {it?.title}
                    </p>

                    {Array.isArray(it?.galleryDataUrls) &&
                      it.galleryDataUrls.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {it.galleryDataUrls.map((imgUrl, i) => (
                            <img
                              key={i}
                              src={imgUrl}
                              alt={`gallery-${i}`}
                              className="w-16 h-16 object-cover rounded-lg border border-white/20 flex-shrink-0"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-white/20 z-30"
          aria-label="Sonraki"
        >
          <ChevronRight size={28} />
        </button>
      </div>

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
          Hizmetlerin detayları için...
          <ChevronRight size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default Explore;
