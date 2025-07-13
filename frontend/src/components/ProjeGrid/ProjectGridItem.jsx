// src/components/ProjectGrid/ProjectGridItem.jsx
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ProjectGridItem = ({ project, index }) => {
  return (
    <motion.div
      className={`
        group relative overflow-hidden rounded-xl bg-cover bg-center text-white 
        ${
          project.size === "large"
            ? "col-span-2 row-span-2 md:row-span-2 md:col-span-2"
            : ""
        }
      `}
      style={{ backgroundImage: `url(${project.image})` }}
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
    >
      {/* Arka plan karartması */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Title */}
      <div
        className="absolute bottom-4 left-4 z-20 text-xl font-semibold 
        transition-transform duration-300 group-hover:-translate-y-12"
      >
        {project.title}
      </div>

      {/* Hover Açıklama */}
      <div
        className="absolute bottom-0 left-0 w-full bg-black/70 text-sm p-4 z-30
        opacity-0 translate-y-full pointer-events-none 
        group-hover:opacity-100 group-hover:translate-y-0 
        transition-all duration-300 ease-in-out"
      >
        {project.description}
      </div>
    </motion.div>
  );
};
ProjectGridItem.propTypes = {
  project: PropTypes.shape({
    image: PropTypes.string,
    size: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string, // Add description validation
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProjectGridItem;
