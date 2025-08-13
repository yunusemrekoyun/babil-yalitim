// src/components/Journal/JournalDetail.jsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import PropTypes from "prop-types";
import {
  CalendarDays,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("tr-TR") : "");

const JournalDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get(`/journals/${id}`);
        setItem(data);
        setLikes(data?.likesCount ?? 0);
      } catch (e) {
        console.error("Journal not found:", e);
        setItem(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const heroUrl = item?.cover?.url || "";
  const dateText = fmtDate(item?.createdAt);

  // Tüm medya: kapak + assets (image/video)
  const media = useMemo(() => {
    const list = [];
    if (item?.cover?.url) {
      list.push({
        url: item.cover.url,
        type: item.cover.resourceType || "image",
        isCover: true,
      });
    }
    const arr = Array.isArray(item?.assets) ? item.assets : [];
    arr.forEach((m) => {
      if (!m?.url) return;
      list.push({
        url: m.url,
        type: m.resourceType || "image",
        isCover: false,
      });
    });
    // Aynı url'i teke indir
    const seen = new Set();
    return list.filter((m) =>
      seen.has(m.url) ? false : (seen.add(m.url), true)
    );
  }, [item]);

  const handleLike = async () => {
    if (!id || liking) return;
    const email = window.prompt("Beğenmek için e‑posta adresinizi girin:");
    if (!email) return;
    try {
      setLiking(true);
      const { data } = await api.post(`/journals/${id}/like`, { email });
      setLikes(data?.likesCount ?? likes + 1);
      setLiked(true);
    } catch (e) {
      if (e?.response?.status === 409) {
        setLiked(true);
        setLikes(e?.response?.data?.likesCount ?? likes);
        alert("Bu haberi zaten beğenmişsiniz.");
      } else {
        alert(e?.response?.data?.message || "Beğeni eklenemedi.");
      }
    } finally {
      setLiking(false);
    }
  };

  // Lightbox helpers
  const openLightbox = useCallback((idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const next = useCallback(
    () => setLightboxIndex((p) => (media.length ? (p + 1) % media.length : 0)),
    [media.length]
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((p) =>
        media.length ? (p - 1 + media.length) % media.length : 0
      ),
    [media.length]
  );

  // Key controls for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, closeLightbox, next, prev]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-pulse text-gray-500">Yükleniyor…</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-red-500 text-xl font-semibold">
        Haber bulunamadı.
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* HERO */}
      <div className="relative h-[42vh] md:h-[56vh] overflow-hidden">
        {heroUrl ? (
          <motion.img
            key={heroUrl}
            src={heroUrl}
            alt={item.title}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        {/* HERO içindeki overlay container */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-4"
        >
          <div className="max-w-[90vw] md:max-w-[60ch] text-left pr-4 md:pr-8">
            <h1
              lang="tr"
              className="text-white text-2xl sm:text-3xl md:text-5xl font-bold
                 leading-tight md:leading-[1.15] break-words hyphens-auto
                 overflow-hidden"
              style={{ wordBreak: "break-word", textWrap: "balance" }}
            >
              {item.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-white/90">
              <span className="inline-flex items-center gap-2 text-sm">
                <CalendarDays size={18} /> {dateText || "—"}
              </span>
              <button
                onClick={handleLike}
                disabled={liking}
                className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition ${
                  liked
                    ? "bg-white text-quaternaryColor border-white"
                    : "bg-white/15 text-white border-white/40 hover:bg-white/25"
                }`}
                aria-label="Beğen"
                title="Beğen"
              >
                <Heart className={liked ? "fill-current" : ""} size={16} />
                {likes}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CONTENT + GALLERY STRIP */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 mt-10 md:mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* İçerik */}
          <motion.article
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 prose prose-sm md:prose-base lg:prose-lg prose-p:leading-relaxed prose-img:rounded-xl prose-headings:text-brandBlue prose-a:text-quaternaryColor max-w-none bg-white/85 backdrop-blur rounded-2xl shadow p-5 md:p-8"
          >
            {/<[a-z][\s\S]*>/i.test(item.content) ? (
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            ) : (
              <p className="whitespace-pre-wrap text-gray-800">
                {item.content}
              </p>
            )}
          </motion.article>

          {/* Galeri Şeridi (Sticky aside) */}
          {media.length > 0 && (
            <motion.aside
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="lg:col-span-1"
            >
              <div className="rounded-2xl bg-white/85 backdrop-blur shadow border p-4 sticky top-6">
                <h3 className="text-base font-semibold text-brandBlue mb-3">
                  Medya Galerisi
                </h3>

                {/* Horizontal strip with snap */}
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 pr-2">
                    {media.map((m, i) => (
                      <button
                        key={`${m.url}-${i}`}
                        type="button"
                        onClick={() => openLightbox(i)}
                        className="relative shrink-0 snap-start focus:outline-none rounded-xl overflow-hidden border bg-white hover:shadow transition"
                        style={{ width: 140, height: 210 }}
                        title={m.type === "video" ? "Videoyu aç" : "Görseli aç"}
                      >
                        {m.type === "video" ? (
                          <>
                            <video
                              src={m.url + "#t=0.1"}
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full inline-flex items-center gap-1">
                              <Play size={12} /> Video
                            </div>
                          </>
                        ) : (
                          <img
                            src={m.url}
                            alt={`media-${i}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Küçük ipucu */}
                <p className="mt-2 text-[11px] text-gray-500">
                  Kaydırın veya bir medyaya tıklayın.
                </p>
              </div>
            </motion.aside>
          )}
        </div>

        {/* Aşağıda geniş “mozaik” opsiyonu (istiyorsan aç) */}
        {/* 
        {media.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.05 }}
            className="mt-10"
          >
            <h2 className="text-lg font-semibold text-brandBlue mb-4">
              Tüm Medyalar
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((m, i) =>
                m.type === "video" ? (
                  <video key={i} src={m.url} controls playsInline className="w-full h-full object-cover rounded-xl shadow" />
                ) : (
                  <img key={i} src={m.url} alt={`asset-${i}`} className="w-full h-full object-cover rounded-xl shadow" loading="lazy" />
                )
              )}
            </div>
          </motion.section>
        )} */}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && media.length > 0 && (
          <Lightbox
            items={media}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>

      <div className="mt-12 pb-16" />
    </section>
  );
};

export default JournalDetail;

/* -------------------- Lightbox Component -------------------- */
const Lightbox = ({ items, index, onClose, onPrev, onNext }) => {
  const [curr, setCurr] = useState(index);
  const startX = useRef(null);

  useEffect(() => setCurr(index), [index]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) {
      onPrev();
      setCurr((p) => (p - 1 + items.length) % items.length);
    } else if (dx < -40) {
      onNext();
      setCurr((p) => (p + 1) % items.length);
    }
    startX.current = null;
  };

  const item = items[curr];

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
      onMouseDown={onBackdrop}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white"
        aria-label="Kapat"
      >
        <X />
      </button>

      {/* Prev / Next */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => {
              onPrev();
              setCurr((p) => (p - 1 + items.length) % items.length);
            }}
            className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            aria-label="Önceki"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => {
              onNext();
              setCurr((p) => (p + 1) % items.length);
            }}
            className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            aria-label="Sonraki"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Media */}
      <motion.div
        key={item?.url}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-5xl"
      >
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {item?.type === "video" ? (
              <video
                src={item.url}
                controls
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            ) : (
              <img
                src={item?.url}
                alt="media"
                className="absolute inset-0 w-full h-full object-contain bg-black"
                loading="eager"
              />
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {items.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {items.map((m, i) => (
              <button
                key={`${m.url}-${i}`}
                onClick={() => setCurr(i)}
                className={`relative rounded-lg overflow-hidden border shrink-0 ${
                  i === curr
                    ? "ring-2 ring-quaternaryColor border-transparent"
                    : "border-white/30"
                }`}
                style={{ width: 72, height: 48 }}
                aria-label={`Medya ${i + 1}`}
              >
                {m.type === "video" ? (
                  <video
                    src={m.url + "#t=0.1"}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={m.url}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
Lightbox.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["image", "video"]),
      isCover: PropTypes.bool,
    })
  ).isRequired,
  index: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
};

Lightbox.defaultProps = {
  index: 0,
  onPrev: () => {},
  onNext: () => {},
};
