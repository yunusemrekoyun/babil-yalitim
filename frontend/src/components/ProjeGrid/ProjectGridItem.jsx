import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const ProjectGridItem = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);

  const coverImage = project?.cover?.url || "";
  const videoUrl = project?.video?.url || null;

  // Hover’da video oynatma
  const handleMouseEnter = () => {
    setHovered(true);
    if (videoUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoUrl && videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Tarih formatlama
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("tr-TR");
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-cover bg-center text-white cursor-pointer group"
      style={{ backgroundImage: videoUrl ? "none" : `url(${coverImage})` }}
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/project-detail/${project._id}`}>
        {/* Video varsa */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Görsel varsa */}
        {!videoUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Başlık */}
        <div
          className={`absolute bottom-4 left-4 z-20 text-xl font-semibold transition-transform duration-300 
          ${hovered ? "translate-y-[-80px]" : "translate-y-0"}`}
        >
          {project.title}
        </div>

        {/* Açıklama + Tarih */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
          <div
            className={`w-full bg-black/70 text-sm p-4 leading-snug
            transition-all duration-300 ease-in-out
            ${
              hovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }`}
          >
            <p>{project.description}</p>
            {(project.startDate || project.endDate || project.completedAt) && (
              <div className="mt-2 text-xs text-gray-300">
                {project.startDate && (
                  <span>Başlangıç: {formatDate(project.startDate)} </span>
                )}
                {project.endDate && (
                  <span>- Bitiş: {formatDate(project.endDate)} </span>
                )}
                {project.completedAt && (
                  <span>- Tamamlandı: {formatDate(project.completedAt)} </span>
                )}
                {project.durationDays && (
                  <span>({project.durationDays} gün)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

ProjectGridItem.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    cover: PropTypes.object,
    video: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    completedAt: PropTypes.string,
    durationDays: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectGridItem;
