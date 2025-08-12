import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import JournalGridItem from "./JournalGridItem";

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
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/journals");
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setJournals(
            list.slice(0, 2).map((j) => ({
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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="relative w-full px-3 sm:px-4 md:px-6 py-10 md:py-12"
      id="journal"
    >
      {/* Başlık */}
      <div className="max-w-6xl mx-auto text-center mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Haberler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded" />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center py-14 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30">
            <p className="text-secondaryColor font-semibold text-lg">
              Henüz haber eklenmemiş.
            </p>
            <p className="text-gray-600 mt-1">
              Yakında yeni içeriklerle buradayız.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {journals.map((item, index) => (
              <JournalGridItem key={item._id} item={item} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && journals.length > 0 && (
          <div className="flex justify-center md:justify-end mt-8">
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => navigate("/journal")}
              className="inline-flex items-center gap-2 text-sm text-white bg-quaternaryColor 
                         px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg 
                         hover:bg-white/20 transition-all duration-300"
            >
              Tüm haberler
              <span aria-hidden>→</span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalGrid;
