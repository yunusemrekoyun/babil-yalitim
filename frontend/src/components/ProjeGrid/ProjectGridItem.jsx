import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useRef } from "react";
import { Link } from "react-router-dom";

// Aynı projeyi birden çok kez loglamamak için
const missingLogSet = new Set();

const ProjectGridItem = ({ project, index, isMobile }) => {
  const videoRef = useRef(null);

  /* -------------------- MOBİL: SADECE backend'in verdiği mobileCoverUrl -------------------- */
  if (isMobile) {
    const mobileSrc = project?.mobileCoverUrl || "";

    if (!mobileSrc) {
      // Aynı proje için sadece 1 kez logla
      const key = project?._id || project?.id || JSON.stringify(project);
      if (!missingLogSet.has(key)) {
        console.error(
          "[PGI mobile] missing mobileCoverUrl for project:",
          project
        );
        missingLogSet.add(key);
      }
      return null; // placeholder yok, hiçbir şey render etme
    }

    return (
      <div className="group relative overflow-hidden rounded-xl text-white cursor-pointer h-full">
        <Link to={`/project-detail/${project._id}`} className="block h-full">
          <div className="absolute inset-0">
            <img
              src={mobileSrc}
              alt={project?.title || "Proje"}
              className="absolute inset-0 w-full h-full object-cover bg-gray-200"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                console.error(
                  "[PGI mobile] image load ERROR",
                  { id: project?._id, title: project?.title },
                  "src:",
                  e.currentTarget?.src
                );
              }}
            />
          </div>

          <div className="absolute inset-0 z-10 bg-black/35" />
          <div className="absolute left-4 bottom-4 z-20">
            <h3 className="text-lg md:text-xl font-semibold">
              {project.title}
            </h3>
          </div>

          <span className="invisible block pb-[56%]" />
        </Link>
      </div>
    );
  }

  /* -------------------- DESKTOP: MEVCUT DAVRANIŞ (DEĞİŞMEDİ) -------------------- */
  const coverImage = project?.cover?.url || "";
  const videoUrl = project?.video?.url || "";

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl text-white cursor-pointer h-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={{
        hidden: { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
        visible: {
          x: 0,
          opacity: 1,
          transition: { duration: 0.6, delay: index * 0.1 },
        },
      }}
      onMouseEnter={() => {
        if (videoUrl && videoRef.current) {
          try {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
          } catch (err) {
            console.error("[PGI desktop] video play error:", err);
          }
        }
      }}
      onMouseLeave={() => {
        if (videoUrl && videoRef.current) {
          try {
            videoRef.current.pause();
          } catch (err) {
            console.error("[PGI desktop] video pause error:", err);
          }
        }
      }}
    >
      <Link to={`/project-detail/${project._id}`} className="block h-full">
        <div className="absolute inset-0">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                console.error(
                  "[PGI desktop] video load ERROR",
                  { id: project?._id, title: project?.title },
                  "src:",
                  e.currentTarget?.currentSrc || e.currentTarget?.src
                );
              }}
            />
          ) : (
            <img
              src={coverImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                console.error(
                  "[PGI desktop] image load ERROR",
                  { id: project?._id, title: project?.title },
                  "src:",
                  e.currentTarget?.src
                );
              }}
            />
          )}
        </div>

        <div className="absolute inset-0 z-10 bg-black/35 transition-opacity duration-300 group-hover:opacity-60" />
        <div className="absolute left-4 bottom-4 z-20">
          <h3 className="text-lg md:text-xl font-semibold transition-transform duration-300 group-hover:-translate-y-1.5">
            {project.title}
          </h3>
        </div>

        <span className="invisible block pb-[56%]" />
      </Link>
    </motion.div>
  );
};

// project, iki farklı veri şekline sahip olabilir: (mobil) veya (desktop)
ProjectGridItem.propTypes = {
  project: PropTypes.oneOfType([
    // MOBİL: /projects/covers cevabı
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      mobileCoverUrl: PropTypes.string, // mobilde beklenen alan
    }),
    // DESKTOP: /projects cevabı
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      cover: PropTypes.object,
      video: PropTypes.object,
      images: PropTypes.array,
    }),
  ]).isRequired,
  index: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default ProjectGridItem;
