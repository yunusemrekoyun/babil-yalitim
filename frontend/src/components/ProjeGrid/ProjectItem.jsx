// src/components/ProjeGrid/ProjectItem.jsx
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const fmt = (v) => (v ? new Date(v).toLocaleDateString("tr-TR") : null);

const ProjectItem = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const videoRef = useRef(null);

  // --- Fallback zinciri (yeni + legacy alanlar) ---
  const coverUrl = project?.cover?.url || "";
  const firstImage = project?.images?.[0]?.url || "";
  const legacyImg =
    project?.imageUrl ||
    project?.imageDataUrl ||
    (Array.isArray(project?.galleryDataUrls) && project.galleryDataUrls[0]) ||
    "";
  const imageToShow = coverUrl || firstImage || legacyImg;

  const videoUrl = project?.video?.url || "";

  const hasImage = Boolean(imageToShow);

  const onEnter = () => {
    setHovered(true);
    if (!hasImage && videoUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };
  const onLeave = () => {
    setHovered(false);
    if (videoRef.current) videoRef.current.pause();
  };

  // Debug (istersen geçici bırak)
  // console.log("[ProjectItem]", { imageToShow, videoUrl, cover: project?.cover, images: project?.images });

  return (
    <motion.article
      className="relative rounded-2xl overflow-hidden border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] group"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link to={`/project-detail/${project._id}`} className="block">
        <div className="relative h-56 md:h-64 overflow-hidden">
          {hasImage && imgOk ? (
            <img
              src={imageToShow}
              alt={project?.title || "Proje"}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                hovered ? "scale-110" : "scale-100"
              }`}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}

          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-90"
            }`}
          />
          <div
            className={`pointer-events-none absolute -inset-y-10 -left-24 w-40 rotate-12 bg-white/25 blur-2xl transition-all duration-700 ${
              hovered ? "translate-x-[140%]" : "translate-x-0"
            }`}
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg md:text-xl font-semibold text-brandBlue">
            {project?.title}
          </h3>

          {project?.category && (
            <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-quaternaryColor/10 text-quaternaryColor border border-quaternaryColor/30">
              {project.category}
            </span>
          )}

          {project?.description && (
            <p
              className="mt-3 text-sm text-gray-700"
              style={clamp2}
              title={project.description}
            >
              {project.description}
            </p>
          )}

          {(project?.startDate ||
            project?.endDate ||
            project?.completedAt ||
            project?.durationDays) && (
            <p className="mt-3 text-xs text-gray-500 space-x-2">
              {project.startDate && (
                <span>Başlangıç: {fmt(project.startDate)}</span>
              )}
              {project.endDate && <span>Bitiş: {fmt(project.endDate)}</span>}
              {project.completedAt && (
                <span>Tamamlandı: {fmt(project.completedAt)}</span>
              )}
              {project.durationDays ? (
                <span>({project.durationDays} gün)</span>
              ) : null}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectItem;
