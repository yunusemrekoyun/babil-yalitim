import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import ServiceItem from "./ServiceItem";
import {
  fetchServicesCached,
  getCachedServices,
} from "../../utils/servicesCache";

const Services = ({ q }) => {
  const cachedServices = getCachedServices();
  const [services, setServices] = useState(() => cachedServices || []);
  const [cat, setCat] = useState("Tümü");
  const [loading, setLoading] = useState(() => !cachedServices);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchServicesCached();
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

  useEffect(() => {
    import("../../pages/ServiceDetailsPage.jsx").catch(() => {});
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
      <div className="mb-5 rounded-[24px] border border-white/40 bg-white/55 p-4 shadow-sm backdrop-blur-xl md:mb-6 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  cat === c
                    ? "border-quaternaryColor bg-quaternaryColor text-white"
                    : "border-white/45 bg-white/80 text-gray-700 hover:bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 md:text-sm">
            Toplam: {services.length} • Filtrelenmiş: {filtered.length}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl py-16">
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
              <ServiceItem service={svc} priority={i < 4} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

Services.propTypes = {
  q: PropTypes.string.isRequired,
};

export default Services;
