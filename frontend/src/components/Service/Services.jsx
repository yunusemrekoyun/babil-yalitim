import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api";
import ServiceItem from "./ServiceItem";
const Services = () => {
  const [services, setServices] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tümü");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/services");
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setServices(list);
      } catch (e) {
        console.error("GET /services error:", e?.response?.data || e);
        if (!cancelled) setErr("Hizmetler getirilemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const uniq = new Set(
      services.map((s) => (s.category || "").trim()).filter(Boolean)
    );
    return ["Tümü", ...Array.from(uniq)];
  }, [services]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return services.filter((s) => {
      const okCat = cat === "Tümü" || (s.category || "").trim() === cat;
      if (!text) return okCat;
      const haystack = `${s.title || ""} ${s.type || ""} ${s.category || ""} ${
        s.description || ""
      }`.toLowerCase();
      return okCat && haystack.includes(text);
    });
  }, [services, q, cat]);

  if (loading)
    return <div className="py-16 text-center text-gray-500">Yükleniyor…</div>;
  if (err) return <div className="py-16 text-center text-red-600">{err}</div>;

  return (
    <section className="w-full">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <label htmlFor="svc-search" className="sr-only">
            Hizmetlerde ara
          </label>
          <input
            id="svc-search"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hizmetlerde ara…"
            className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                cat === c
                  ? "bg-quaternaryColor text-white border-quaternaryColor"
                  : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* sayaç */}
      <p className="text-xs text-gray-500 mb-4">
        Toplam: {services.length} • Filtrelenmiş: {filtered.length}
      </p>

      {/* Grid (dikey kartlar için geniş aralıklarla) */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 border border-dashed rounded-2xl py-16">
          Sonuç bulunamadı.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((svc, i) => (
            <motion.div
              key={svc._id || i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
            >
              <ServiceItem service={svc} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Services;


