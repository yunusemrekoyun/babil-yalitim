import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const ProjectGridItem = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);

  // Görsel seçim sırası: imageDataUrl → galleryDataUrls[0] → imageUrl → placeholder
  const bgImage =
    project.imageDataUrl ||
    (Array.isArray(project.galleryDataUrls) && project.galleryDataUrls[0]) ||
    project.imageUrl ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzI1MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-cover bg-center text-white cursor-pointer group"
      style={{ backgroundImage: `url(${bgImage})` }}
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/project-detail/${project._id}`}>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div
          className={`absolute bottom-4 left-4 z-20 text-xl font-semibold transition-transform duration-300 
          ${hovered ? "translate-y-[-80px]" : "translate-y-0"}
        `}
        >
          {project.title}
        </div>

        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
          <div
            className={`w-full bg-black/70 text-sm p-4 leading-snug
            transition-all duration-300 ease-in-out
            ${
              hovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }
          `}
          >
            {project.description}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

ProjectGridItem.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string,
    imageUrl: PropTypes.string, // eski alan
    imageDataUrl: PropTypes.string, // yeni alan (base64 data URL)
    galleryDataUrls: PropTypes.array, // yeni galeri alanı (data URL dizisi)
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectGridItem;
