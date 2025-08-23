import { useEffect, useState } from "react";
import ProjectGridItem from "./ProjectGridItem";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import api from "../../api";

const ProjectGrid = () => {
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = isMobile ? "/projects/covers" : "/projects";

        const { data } = await api.get(endpoint);

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("[ProjectGrid] unexpected payload:", data);
          setProjects([]);
        }
      } catch (err) {
        console.error("[ProjectGrid] fetch error:", err);
        setProjects([]);
      }
    };

    fetchData();

    const onResize = () =>
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile]);

  const visibleProjects = isMobile ? projects.slice(0, 4) : projects;

  // desktop buton animasyonu (mobilde kapalı)
  const motionProps = !isMobile
    ? {
        initial: { x: 100, opacity: 0 },
        whileInView: { x: 0, opacity: 1 },
        viewport: { once: false, amount: 0.5 },
        transition: { duration: 0.6, ease: "easeOut" },
        whileHover: { scale: 1.05 },
      }
    : {};

  return (
    <section className="relative w-full px-4 py-16">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Projeler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[250px]">
        {visibleProjects.map((project, index) => (
          <ProjectGridItem
            key={project._id || index}
            project={project}
            index={index}
            isMobile={isMobile}
          />
        ))}
      </div>

      <motion.div {...motionProps} className="absolute bottom-2 right-6 z-40">
        <a
          href="/projects"
          className={`flex items-center gap-2 text-sm text-white bg-quaternaryColor px-4 py-2 rounded-full ${
            isMobile
              ? ""
              : "hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 transition-all duration-300"
          }`}
        >
          Tüm Projeleri Gör
          <ChevronRight size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default ProjectGrid;
