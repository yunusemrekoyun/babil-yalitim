// src/components/ProjeGrid/ProjectGridItem.jsx
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useRef } from "react";
import { Link } from "react-router-dom";

const ProjectGridItem = ({ project, index }) => {
  const videoRef = useRef(null);

  const coverImage = project?.cover?.url || "";
  const videoUrl = project?.video?.url || null;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl text-white cursor-pointer"
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
          } catch {
            console.error("Error playing video");
          }
        }
      }}
      onMouseLeave={() => {
        if (videoUrl && videoRef.current) {
          try {
            videoRef.current.pause();
          } catch {
            console.error("Error pausing video");
          }
        }
      }}
    >
      <Link to={`/project-detail/${project._id}`} className="block h-full">
        {/* MEDYA */}
        <div className="absolute inset-0">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <img
              src={coverImage}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          )}
        </div>

        {/* OVERLAY (hover’da biraz koyulaşır) */}
        <div className="absolute inset-0 z-10 bg-black/35 transition-opacity duration-300 group-hover:opacity-60" />

        {/* BAŞLIK (ufak yukarı hareket) */}
        <div className="absolute left-4 bottom-4 z-20">
          <h3 className="text-lg md:text-xl font-semibold transition-transform duration-300 group-hover:-translate-y-1.5">
            {project.title}
          </h3>
        </div>

        {/* tıklanabilirliği korumak için görünmeyen bir spacer */}
        <span className="invisible block pb-[56%]" />
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
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectGridItem;
