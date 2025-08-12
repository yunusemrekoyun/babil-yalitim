import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import JournalCard from "./JournalCard";

const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/30 backdrop-blur-md shadow-md">
    <div className="w-full h-56 bg-gray-200/60 animate-pulse" />
    <div className="p-5">
      <div className="h-4 w-32 bg-gray-200/70 rounded mb-3 animate-pulse" />
      <div className="h-5 w-3/4 bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200/70 rounded animate-pulse" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30">
    <p className="text-secondaryColor font-semibold text-lg">
      Henüz haber eklenmemiş.
    </p>
    <p className="text-gray-600 mt-1">Yakında yeni içeriklerle buradayız.</p>
  </div>
);

// Backend -> UI normalize
const normalize = (j) => ({
  _id: j?._id,
  title: j?.title || "",
  coverUrl: j?.cover?.url || "",
  excerpt: j?.content || "",
  date: j?.createdAt || j?.updatedAt || null,
  tags: Array.isArray(j?.tags) ? j.tags : [], // varsa
  likesCount: j?.likesCount ?? 0,
});

const JournalPreview = ({ data = [], loading = false, error = "" }) => {
  const items = useMemo(() => data.map(normalize), [data]);

  // 🔎 Arama (başlık + içerik + etiket)
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => {
      const haystack = `${it.title} ${it.excerpt} ${(it.tags || []).join(
        " "
      )}`.toLowerCase();
      return haystack.includes(s);
    });
  }, [items, q]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-white/40 border border-white/30 rounded-2xl py-10">
        {error}
      </div>
    );
  }

  if (!items.length) return <EmptyState />;

  return (
    <>
      {/* Toolbar — diğer sayfalarla aynı */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <label htmlFor="jrnl-search" className="sr-only">
            Haberlerde ara
          </label>
          <input
            id="jrnl-search"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Haberlerde ara…"
            className="w-full rounded-xl border border-white/40 bg-white/60 backdrop-blur px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor transition shadow-sm"
          />
        </div>
      </div>

      {/* sayaç */}
      <p className="text-xs text-gray-500 mb-4">
        Toplam: {items.length} • Filtrelenmiş: {filtered.length}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <JournalCard key={item._id || index} item={item} index={index} />
        ))}
      </div>
    </>
  );
};

JournalPreview.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default JournalPreview;
