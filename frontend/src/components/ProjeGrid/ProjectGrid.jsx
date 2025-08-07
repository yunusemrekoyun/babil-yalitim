// frontend/src/components/ProjeGrid/ProjectGrid.jsx
import { useEffect, useState } from "react";
import ProjectGridItem from "./ProjectGridItem";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const ProjectGrid = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.warn("Beklenmeyen veri formatı:", data);
        }
      })
      .catch((err) => console.error("Proje verileri alınamadı:", err));
  }, []);

  return (
    <section className="relative w-full px-4 py-16">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Projeler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {projects.map((project, index) => (
          <ProjectGridItem key={project._id || index} project={project} index={index} />
        ))}
      </div>

      {/* Sağ alt buton */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className="absolute bottom-2 right-6 z-40"
      >
        <a
          href="/projects"
          className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
            px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 
            transition-all duration-300"
        >
          Tüm Projeleri Gör
          <ChevronRight size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default ProjectGrid;