// frontend/src/components/ProjeGrid/ProjectDetail.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { CalendarDays, Tag, Film, Images, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fmt = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("tr-TR");
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/projects/${id}`)
      .then(({ data }) => {
        setProject(data);
        setNotFound(false);
        setActiveIdx(0);
        setImgOk(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const images = useMemo(() => {
    if (!project) return [];
    const arr = [];
    if (project.cover?.url) arr.push(project.cover.url);
    if (Array.isArray(project.images)) {
      project.images.forEach((m) => m?.url && arr.push(m.url));
    }
    return arr;
  }, [project]);

  const heroImage = images[activeIdx] || null;
  const hasAnyImage = images.length > 0;
  const hasVideo = Boolean(project?.video?.url);

  useEffect(() => {
    const onKey = (e) => {
      if (!hasAnyImage) return;
      if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setActiveIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, hasAnyImage]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-pulse text-gray-500">Yükleniyor…</div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="text-center py-20 text-red-500 text-xl font-semibold">
        Proje bulunamadı.
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* HERO */}
      <div className="relative h-[42vh] md:h-[56vh] overflow-hidden">
        {hasAnyImage ? (
          <motion.img
            key={heroImage + String(imgOk)}
            src={heroImage}
            alt={project.title}
            onError={() => setImgOk(false)}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : hasVideo ? (
          <video
            ref={videoRef}
            src={project.video.url}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        )}

        {/* üst katmanlar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="absolute left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 bottom-28 md:bottom-32"
        >
          <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow">
            {project.title}
          </h1>
        </motion.div>

        {/* 👇 yeni: thumbnail şeridi (hero içinde) */}
        {images.length > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-full max-w-6xl px-4">
            <div className="rounded-xl bg-black/35 backdrop-blur-md border border-white/20 px-3 py-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`relative flex-shrink-0 h-16 w-24 md:h-20 md:w-28 rounded-lg overflow-hidden border transition 
                      ${
                        i === activeIdx
                          ? "ring-2 ring-brandBlue border-transparent"
                          : "border-white/30 hover:border-white/60"
                      }`}
                    title={`Görsel ${i + 1}`}
                    aria-label={`Görsel ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sol kolon: açıklama */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 bg-white/80 backdrop-blur rounded-2xl shadow p-6"
          >
            <h2 className="text-xl font-semibold text-brandBlue mb-3">
              Proje Hakkında
            </h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
              {project.description || "Açıklama mevcut değil."}
            </p>
          </motion.div>

          {/* Sağ kolon: bilgiler + video kartı + mini görsel */}
          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.05 }}
            className="space-y-6"
          >
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6">
              <h3 className="text-base font-semibold text-brandBlue mb-4">
                Proje Bilgileri
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <Tag size={18} className="text-brandBlue flex-none mt-0.5" />
                  <span>
                    <strong>Kategori:</strong>{" "}
                    {project.category || "Belirtilmemiş"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="text-brandBlue flex-none mt-0.5"
                  />
                  <span className="space-x-2">
                    {project.startDate && (
                      <span>Başlangıç: {fmt(project.startDate)}</span>
                    )}
                    {project.endDate && (
                      <span>Bitiş: {fmt(project.endDate)}</span>
                    )}
                    {!project.startDate && !project.endDate && (
                      <span>Oluşturulma: {fmt(project.createdAt)}</span>
                    )}
                  </span>
                </li>
                {(project.durationDays || project.completedAt) && (
                  <li className="flex items-start gap-3">
                    <Clock
                      size={18}
                      className="text-brandBlue flex-none mt-0.5"
                    />
                    <span className="space-x-2">
                      {project.completedAt && (
                        <span>Tamamlandı: {fmt(project.completedAt)}</span>
                      )}
                      {project.durationDays ? (
                        <span>({project.durationDays} gün)</span>
                      ) : null}
                    </span>
                  </li>
                )}
                {images.length > 0 && (
                  <li className="flex items-start gap-3">
                    <Images
                      size={18}
                      className="text-brandBlue flex-none mt-0.5"
                    />
                    <span>{images.length} görsel</span>
                  </li>
                )}
              </ul>
            </div>

            {hasVideo && (
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-4">
                <div className="flex items-center gap-2 mb-3 text-brandBlue">
                  <Film size={18} />
                  <h3 className="font-semibold text-sm">Proje Videosu</h3>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <video
                    src={project.video.url}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-3">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                {hasAnyImage ? (
                  <motion.img
                    key={`mini-${heroImage}`}
                    src={heroImage}
                    alt="Kapak"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                ) : hasVideo ? (
                  <video
                    src={project.video.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    controls
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="mt-12 pb-16 bg-gray-50" />
    </section>
  );
};

export default ProjectDetail;
