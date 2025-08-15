import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import JournalGridItem from "./JournalGridItem";

const AUTOPLAY_MS = 4000;

const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/30 backdrop-blur-md shadow-md">
    <div className="w-full h-56 md:h-60 bg-gray-200/60 animate-pulse" />
    <div className="p-6">
      <div className="h-4 w-28 bg-gray-200/70 rounded mb-3 animate-pulse" />
      <div className="h-5 w-3/4 bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200/70 rounded animate-pulse" />
    </div>
  </div>
);

const JournalGrid = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  // slider state
  const [groupIdx, setGroupIdx] = useState(0); // 0..groups-1
  const [perView, setPerView] = useState(1);   // sm:1, md+:2
  const [paused, setPaused] = useState(false);

  // drag state
  const sliderRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0 });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Veriyi çek
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/journals");
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setJournals(
            list.map((j) => ({
              _id: j._id,
              title: j.title,
              coverUrl: j?.cover?.url || "",
              content: j?.content || "",
              date: j?.createdAt || j?.updatedAt || null,
            }))
          );
        }
      } catch (e) {
        console.error("GET /journals failed:", e?.response?.data || e);
        if (!cancelled) setJournals([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const len = journals.length;

  // Per-view: md ve üzeri 2, altında 1
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setPerView(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const groups = Math.max(1, Math.ceil(len / perView));

  // Otoplay
  useEffect(() => {
    if (!len || paused) return;
    timerRef.current = setInterval(() => {
      setGroupIdx((p) => (p + 1) % groups);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [len, groups, paused]);

  const goToGroup = (i) => setGroupIdx(((i % groups) + groups) % groups);

  // Touch handlers (parmakla kaydırma)
  const handleTouchStart = (e) => {
    setPaused(true);
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
    setDragging(true);
    setDragX(0);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    // yatay baskınsa sürüklemeyi uygula
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragX(dx);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 60; // px
    if (Math.abs(dragX) > threshold) {
      if (dragX < 0) setGroupIdx((p) => (p + 1) % groups);           // sola → sonraki
      else setGroupIdx((p) => (p - 1 + groups) % groups);             // sağa → önceki
    }
    setDragging(false);
    setDragX(0);
    setTimeout(() => setPaused(false), 150);
  };

  return (
    <section className="relative w-full px-3 sm:px-4 md:px-6 py-10 md:py-12" id="journal">
      {/* Başlık */}
      <div className="max-w-6xl mx-auto text-center mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Haberler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded" />
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : len === 0 ? (
          <div className="text-center py-14 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30">
            <p className="text-secondaryColor font-semibold text-lg">Henüz haber eklenmemiş.</p>
            <p className="text-gray-600 mt-1">Yakında yeni içeriklerle buradayız.</p>
          </div>
        ) : (
          <>
            {/* Slider (ikili görünüm md+) */}
            <div
              className="relative overflow-hidden rounded-2xl"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                ref={sliderRef}
                className="flex"
                // grup kaydırma + drag offset
                style={{
                  willChange: "transform",
                  transform: `translateX(calc(-${groupIdx * 100}% + ${dragX}px))`,
                  transition: dragging ? "none" : "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {journals.map((item, i) => (
                  <div
                    key={item._id}
                    className="min-w-full md:min-w-[50%] px-1 sm:px-2"
                  >
                    <JournalGridItem item={item} index={i} />
                  </div>
                ))}

                {/* Eleman sayısı tek ve md+ ise hizayı koru */}
                {perView === 2 && len % 2 === 1 && (
                  <div className="hidden md:block min-w-[50%] px-1 sm:px-2" />
                )}
              </motion.div>
            </div>

            {/* Dots (grup bazlı) */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: groups }).map((_, i) => {
                const active = i === groupIdx;
                return (
                  <button
                    key={i}
                    aria-label={`Grup ${i + 1}`}
                    onClick={() => goToGroup(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      active ? "w-6 bg-quaternaryColor" : "w-2.5 bg-gray-300"
                    }`}
                  />
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className="flex justify-center md:justify-end mt-8"
            >
              <button
                onClick={() => navigate("/journal")}
                className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
                           px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 
                           transition-all duration-300"
              >
                Tüm haberleri Gör
                <span aria-hidden>→</span>
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default JournalGrid;