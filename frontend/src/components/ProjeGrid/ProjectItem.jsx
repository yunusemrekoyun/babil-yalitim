import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";

const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const ProjectItem = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);

  const bgImage =
    project?.imageDataUrl ||
    (Array.isArray(project?.galleryDataUrls) && project.galleryDataUrls[0]) ||
    project?.imageUrl ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzI1MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

  return (
    <motion.article
      className="relative rounded-2xl overflow-hidden border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] group"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/project-detail/${project._id}`} className="block">
        {/* Image */}
        <div className="relative h-56 md:h-64 overflow-hidden">
          <img
            src={bgImage}
            alt={project?.title || "Proje"}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              hovered ? "scale-110" : "scale-100"
            }`}
            loading="lazy"
          />
          {/* Shine */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-90"
            }`}
          />
          {/* Light streak */}
          <div
            className={`pointer-events-none absolute -inset-y-10 -left-24 w-40 rotate-12 bg-white/25 blur-2xl transition-all duration-700 ${
              hovered ? "translate-x-[140%]" : "translate-x-0"
            }`}
          />
        </div>

        {/* Content */}
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
        </div>
      </Link>
    </motion.article>
  );
};

ProjectItem.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    imageUrl: PropTypes.string,
    imageDataUrl: PropTypes.string,
    galleryDataUrls: PropTypes.array,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectItem;
