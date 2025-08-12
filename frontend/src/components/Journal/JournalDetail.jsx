import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";
import { CalendarDays, Heart, Play } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const JournalDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/journals/${id}`)
      .then(({ data }) => {
        setItem(data);
        setLikes(data?.likesCount ?? 0);
      })
      .catch((e) => console.error("Journal not found:", e))
      .finally(() => setLoading(false));
  }, [id]);

  const heroUrl = item?.cover?.url || "";
  const dateText = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString("tr-TR")
    : "";

  const gallery = useMemo(() => {
    const arr = Array.isArray(item?.assets) ? item.assets : [];
    return arr.filter((m) => m?.url);
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
      // 409: zaten beğenilmiş
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
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow">
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
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 mt-12 md:mt-16">
        <motion.article
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="prose prose-sm md:prose-base lg:prose-lg prose-p:leading-relaxed prose-img:rounded-xl prose-headings:text-brandBlue prose-a:text-quaternaryColor max-w-none bg-white/80 backdrop-blur rounded-2xl shadow p-5 md:p-8"
        >
          {/* İçerik metni (HTML ya da düz) */}
          {/<[a-z][\s\S]*>/i.test(item.content) ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <p className="whitespace-pre-wrap text-gray-800">{item.content}</p>
          )}
        </motion.article>

        {/* GALLERY */}
        {gallery.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.05 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold text-brandBlue mb-4">Medya</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((m, i) =>
                m.resourceType === "video" ? (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden shadow"
                  >
                    <video
                      src={m.url}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full inline-flex items-center gap-1">
                      <Play size={12} /> Video
                    </div>
                  </div>
                ) : (
                  <img
                    key={i}
                    src={m.url}
                    alt={`asset-${i}`}
                    className="w-full h-full object-cover rounded-xl shadow"
                    loading="lazy"
                  />
                )
              )}
            </div>
          </motion.section>
        )}
      </div>

      <div className="mt-12 pb-16" />
    </section>
  );
};

export default JournalDetail;
