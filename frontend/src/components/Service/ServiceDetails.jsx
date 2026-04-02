import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  CalendarDays,
  Tag,
  Images,
  Layers,
  PlayCircle,
  X,
} from "lucide-react";
import api from "../../api";
import OtherServices from "./OtherServices";
import { getVideoPosterUrl, looksVideo } from "../../utils/media";

const fmt = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("tr-TR");
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const firstImageFrom = (images = []) => {
  for (const m of images) {
    const u = m?.url;
    if (!u) continue;
    const isImg =
      m?.resourceType === "image" || (!m?.resourceType && !looksVideo(u));
    if (isImg) return u;
  }
  return null;
};

const isVideoMedia = (media) =>
  media?.resourceType === "video" || looksVideo(media?.url);

const ServiceDetails = () => {
  const { id } = useParams();
  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeIdx, setActiveIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [videoModal, setVideoModal] = useState(null);

  useEffect(() => {
    if (!videoModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setVideoModal(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoModal]);

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
        posterUrl: svc.cover.posterUrl || "",
        type: svc.cover.resourceType || "image",
      });
    } else if (svc.imageUrl) {
      list.push({ url: svc.imageUrl, type: "image" });
    } else if (svc.imageDataUrl) {
      list.push({ url: svc.imageDataUrl, type: "image" });
    }

    if (Array.isArray(svc.images)) {
      svc.images.forEach((m) => {
        if (m?.url) {
          list.push({
            url: m.url,
            posterUrl: m.posterUrl || "",
            type: m.resourceType || "image",
          });
        }
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

            {Array.isArray(svc.subServices) && svc.subServices.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-brandBlue mb-4">
                  Alt Hizmetler
                </h3>
                <div className="space-y-4">
                  {svc.subServices.map((sub, index) => {
                    const subCoverIsVideo =
                      sub?.cover?.resourceType === "video" ||
                      looksVideo(sub?.cover?.url);
                    const subPreview =
                      (!subCoverIsVideo && sub?.cover?.url) ||
                      firstImageFrom(sub?.images) ||
                      (subCoverIsVideo ? getVideoPosterUrl(sub?.cover) : null) ||
                      "";

                    return (
                      <div
                        key={sub?._id || `${sub?.title}-${index}`}
                        className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm"
                      >
                        <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
                          <div className="relative aspect-[4/5] bg-slate-100">
                            {subPreview ? (
                              <img
                                src={subPreview}
                                alt={sub.title}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : subCoverIsVideo ? (
                              <video
                                src={sub.cover.url}
                                className="absolute inset-0 h-full w-full object-cover"
                                muted
                                playsInline
                                preload="metadata"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                          </div>
                          <div className="p-5 md:p-6">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-semibold text-brandBlue">
                                {sub.title}
                              </h4>
                              {sub.type && (
                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                                  {sub.type}
                                </span>
                              )}
                              {sub.category && (
                                <span className="inline-flex rounded-full bg-quaternaryColor/10 px-3 py-1 text-[11px] font-semibold text-quaternaryColor">
                                  {sub.category}
                                </span>
                              )}
                            </div>
                            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-gray-700">
                              {sub.description}
                            </p>
                            {Array.isArray(sub.usageAreas) &&
                              sub.usageAreas.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {sub.usageAreas.map((area) => (
                                    <span
                                      key={`${sub._id || sub.title}-${area}`}
                                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                                    >
                                      {area}
                                    </span>
                                  ))}
                                </div>
                              )}
                            {Array.isArray(sub.images) && sub.images.length > 0 && (
                              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {sub.images.map((media, mediaIndex) => {
                                  const mediaIsVideo = isVideoMedia(media);
                                  const previewUrl = mediaIsVideo
                                    ? getVideoPosterUrl(media)
                                    : media.url;

                                  return mediaIsVideo ? (
                                    <button
                                      key={`${media.url}-${mediaIndex}`}
                                      type="button"
                                      onClick={() =>
                                        setVideoModal({
                                          url: media.url,
                                          poster: previewUrl || "",
                                          title: `${sub.title} videosu`,
                                        })
                                      }
                                      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brandBlue/50"
                                      aria-label={`${sub.title} videosunu aç`}
                                    >
                                      {previewUrl ? (
                                        <img
                                          src={previewUrl}
                                          alt={`${sub.title} video önizleme`}
                                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white/85">
                                          <div className="flex flex-col items-center gap-2">
                                            <PlayCircle size={34} />
                                            <span className="text-sm font-medium">
                                              Videoyu izle
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                                        <span className="inline-flex translate-y-2 items-center gap-2 rounded-full border border-white/30 bg-black/45 px-4 py-2 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                                          <PlayCircle size={18} />
                                          Videoyu izle
                                        </span>
                                      </div>

                                      <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                                        Video
                                      </span>
                                    </button>
                                  ) : (
                                    <img
                                      key={`${media.url}-${mediaIndex}`}
                                      src={media.url}
                                      alt={`${sub.title}-${mediaIndex + 1}`}
                                      className="aspect-video w-full rounded-2xl object-cover"
                                      loading="lazy"
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              const coverUrl = it?.cover?.url || "";
              const coverIsVideo =
                it?.cover?.resourceType === "video" || looksVideo(coverUrl);

              // 1) Galeriden ilk image
              const galleryImg = firstImageFrom(it?.images);

              // 2) Kapak video ise Cloudinary'den ilk kare thumb dene
              const videoThumb = coverIsVideo
                ? getVideoPosterUrl(it?.cover || { url: coverUrl, resourceType: "video" })
                : null;

              // 3) Kapak image ise onu kullan
              const coverImage = !coverIsVideo ? coverUrl : null;

              // Öncelik: galleryImg > coverImage > videoThumb > legacy
              const preview =
                galleryImg ||
                coverImage ||
                videoThumb ||
                it?.imageDataUrl ||
                it?.imageUrl ||
                "";

              return (
                <Link
                  key={it._id}
                  to={`/services/${it._id}`}
                  className="group rounded-2xl overflow-hidden border bg-white hover:shadow-md transition"
                >
                  <div className="relative aspect-[9/16]">
                    {preview ? (
                      <img
                        src={preview}
                        alt={it.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : coverIsVideo ? (
                      // son çare: video'yu metadata ile, gerekirse poster düşer
                      <video
                        src={coverUrl}
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}

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

      <AnimatePresence>
        {videoModal ? (
          <VideoModal item={videoModal} onClose={() => setVideoModal(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
};

const VideoModal = ({ item, onClose }) => {
  if (!item?.url) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/82 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg transition hover:bg-black/70"
          aria-label="Videoyu kapat"
        >
          <X size={20} />
        </button>

        <div className="overflow-hidden rounded-[28px] bg-black shadow-[0_40px_120px_-32px_rgba(0,0,0,0.72)]">
          <div className="aspect-video w-full bg-black">
            <video
              src={item.url}
              poster={item.poster || undefined}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {item.title ? (
          <div className="mt-3 text-center text-sm font-medium text-white/82">
            {item.title}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

VideoModal.propTypes = {
  item: PropTypes.shape({
    url: PropTypes.string,
    poster: PropTypes.string,
    title: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ServiceDetails;
