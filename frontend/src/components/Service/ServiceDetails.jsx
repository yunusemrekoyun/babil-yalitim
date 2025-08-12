import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, CalendarDays, Tag, Images, Layers } from "lucide-react";
import api from "../../api";
import OtherServices from "./OtherServices";

const fmt = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("tr-TR");
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const ServiceDetails = () => {
  const { id } = useParams();
  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeIdx, setActiveIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/services/${id}`);
        if (!cancelled) {
          setSvc(data);
          setActiveIdx(0);
          setNotFound(false);
        }
      } catch (e) {
        console.error("GET /services/:id error:", e?.response?.data || e);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // --- MEDYA: {url, type} olarak kur (video için gerekli) ---
  const media = useMemo(() => {
    if (!svc) return [];
    const list = [];

    if (svc.cover?.url) {
      list.push({
        url: svc.cover.url,
        type: svc.cover.resourceType || "image",
      });
    } else if (svc.imageUrl) {
      list.push({ url: svc.imageUrl, type: "image" });
    } else if (svc.imageDataUrl) {
      list.push({ url: svc.imageDataUrl, type: "image" });
    }

    if (Array.isArray(svc.images)) {
      svc.images.forEach((m) => {
        if (m?.url) list.push({ url: m.url, type: m.resourceType || "image" });
      });
    }
    if (Array.isArray(svc.galleryDataUrls)) {
      svc.galleryDataUrls.forEach((u) => list.push({ url: u, type: "image" }));
    }

    // aynı url'leri temizle
    const unique = [];
    const seen = new Set();
    for (const m of list) {
      if (!seen.has(m.url)) {
        seen.add(m.url);
        unique.push(m);
      }
    }
    return unique;
  }, [svc]);

  // Related
  useEffect(() => {
    let cancelled = false;
    if (!svc) return;
    (async () => {
      try {
        setLoadingRelated(true);
        const { data } = await api.get("/services");
        const list = Array.isArray(data) ? data : [];
        let rel = list.filter(
          (x) =>
            x._id !== svc._id &&
            (x.category || "").trim() === (svc.category || "").trim()
        );
        if (rel.length < 4) {
          const rest = list.filter(
            (x) => x._id !== svc._id && !rel.some((r) => r._id === x._id)
          );
          rel = [...rel, ...rest].slice(0, 4);
        } else {
          rel = rel.slice(0, 4);
        }
        if (!cancelled) setRelated(rel);
      } catch (e) {
        console.error("GET /services (related) error:", e?.response?.data || e);
      } finally {
        if (!cancelled) setLoadingRelated(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [svc]);

  const active = media[activeIdx];

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-pulse text-gray-500">Yükleniyor…</div>
      </div>
    );
  }

  if (notFound || !svc) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">
            Servis bulunamadı.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-900"
          >
            <ChevronLeft size={16} />
            Hizmetler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-white border hover:bg-gray-50"
          aria-label="Hizmetlere dön"
        >
          <ChevronLeft size={16} />
          Geri
        </Link>
        <div className="text-xs text-gray-500">{fmt(svc?.createdAt) || ""}</div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="lg:col-span-2"
        >
          {/* Media */}
          <div className="rounded-3xl overflow-hidden border bg-white shadow-sm">
            <div className="relative aspect-[9/16]">
              {active ? (
                active.type === "video" ? (
                  <video
                    key={active.url}
                    src={active.url}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    loop
                    controls
                  />
                ) : (
                  <motion.img
                    key={active.url}
                    src={active.url}
                    alt={svc.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0.2, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
            </div>

            {media.length > 1 && (
              <div className="p-3">
                <div className="flex gap-2 overflow-x-auto">
                  {media.map((m, i) => (
                    <button
                      key={`${m.url}-${i}`}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`relative h-16 w-12 rounded-lg overflow-hidden border transition ${
                        i === activeIdx
                          ? "ring-2 ring-brandBlue border-transparent"
                          : "border-gray-200"
                      }`}
                      title={`Görsel ${i + 1}`}
                    >
                      {m.type === "video" ? (
                        <video
                          src={m.url}
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={m.url}
                          alt={`thumb-${i}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-6">
            <h1 className="text-2xl md:text-4xl font-extrabold text-brandBlue tracking-tight">
              {svc.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-quaternaryColor/10 text-quaternaryColor border border-quaternaryColor/30">
                <Tag size={16} />
                {svc.category || "Kategori yok"}
              </span>
              {svc.type && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border">
                  <Layers size={16} />
                  {svc.type}
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border">
                <CalendarDays size={16} />
                {fmt(svc.createdAt) || "—"}
              </span>
              {Array.isArray(svc.images) && svc.images.length > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border">
                  <Images size={16} />+{svc.images.length} görsel
                </span>
              )}
            </div>

            {svc.description && (
              <div className="mt-6 leading-relaxed text-gray-700 whitespace-pre-wrap break-words">
                {svc.description}
              </div>
            )}

            {Array.isArray(svc.usageAreas) && svc.usageAreas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-brandBlue mb-3">
                  Kullanım Alanları
                </h3>
                <div className="flex flex-wrap gap-2">
                  {svc.usageAreas.map((u) => (
                    <span
                      key={u}
                      className="text-xs px-3 py-1 rounded-full bg-white border text-gray-700"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* SAĞ */}
        <div className="lg:col-span-1">
          <OtherServices currentId={svc._id} />
        </div>
      </div>

      {/* Benzerler */}
      <div className="mt-10 md:mt-14 mb-16">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-xl md:text-2xl font-bold text-secondaryColor mb-4"
        >
          Benzer Hizmetler
        </motion.h2>

        {loadingRelated ? (
          <div className="text-sm text-gray-500">Yükleniyor…</div>
        ) : related.length === 0 ? (
          <div className="text-sm text-gray-500">Henüz başka hizmet yok.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((it) => {
              const cover =
                it?.cover?.url ||
                it?.imageDataUrl ||
                it?.imageUrl ||
                it?.images?.find((m) => m?.url)?.url ||
                "";
              return (
                <Link
                  key={it._id}
                  to={`/services/${it._id}`}
                  className="group rounded-2xl overflow-hidden border bg-white hover:shadow-md transition"
                >
                  <div className="relative aspect-[9/16]">
                    <img
                      src={cover}
                      alt={it.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="text-sm font-semibold line-clamp-2">
                        {it.title}
                      </div>
                      {it.category && (
                        <div className="mt-1 text-[11px] px-2 py-0.5 inline-block rounded-full bg-white/20 border border-white/30 backdrop-blur">
                          {it.category}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceDetails;
