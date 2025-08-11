// frontend/src/components/ProjeGrid/ProjectDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { CalendarDays, Tag } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/projects/${id}`)
      .then(({ data }) => {
        setProject(data);
        setNotFound(false);
        setActiveIdx(0);
      })
      .catch((err) => {
        console.error("Proje bulunamadı:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const images = useMemo(() => {
    if (!project) return [];
    const arr = [];
    if (project.imageDataUrl) arr.push(project.imageDataUrl);
    if (Array.isArray(project.galleryDataUrls)) {
      project.galleryDataUrls.forEach((u) => u && arr.push(u));
    }
    if (!arr.length && project.imageUrl) arr.push(project.imageUrl);
    return arr;
  }, [project]);

  const cover = images[activeIdx];

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
        {cover ? (
          <motion.img
            key={cover}
            src={cover}
            alt={project.title}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow">
            {project.title}
          </h1>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 mt-16 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol: açıklama */}
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

            {/* Thumbnail galeri (mobilde aşağıda, desktop’ta bu kart içinde) */}
            {images.length > 1 && (
              <div className="mt-6">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`relative flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden border transition 
                        ${
                          i === activeIdx
                            ? "ring-2 ring-brandBlue border-transparent"
                            : "border-gray-200"
                        }`}
                      title={`Görsel ${i + 1}`}
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
            )}
          </motion.div>

          {/* Sağ: bilgiler */}
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
                <li className="flex items-center gap-3">
                  <Tag size={18} className="text-brandBlue flex-none" />
                  <span>
                    <strong>Kategori:</strong>{" "}
                    {project.category || "Belirtilmemiş"}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CalendarDays
                    size={18}
                    className="text-brandBlue flex-none"
                  />
                  <span>
                    <strong>Tarih:</strong>{" "}
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString("tr-TR")
                      : "—"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Küçük kapak kartı (thumb seçimiyle senkron) */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-3">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                {cover ? (
                  <motion.img
                    key={`mini-${cover}`}
                    src={cover}
                    alt="Kapak"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Alt galeri: mobilde ayrı gösterim (lg:hidden) */}
        {images.length > 1 && (
          <div className="lg:hidden mt-6">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={`m-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`relative flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden border transition 
                    ${
                      i === activeIdx
                        ? "ring-2 ring-brandBlue border-transparent"
                        : "border-gray-200"
                    }`}
                  title={`Görsel ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`m-thumb-${i}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Arka plan dolgu */}
      <div className="mt-12 pb-16 bg-gray-50" />
    </section>
  );
};

export default ProjectDetail;
