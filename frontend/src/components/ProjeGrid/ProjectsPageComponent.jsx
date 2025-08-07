// src/components/Projects/ProjectsPageComponent.jsx
import { useEffect, useState } from "react";
import ProjectGridItem from "./ProjectGridItem";
import api from "../../api"; // ← backend bağlantısı için

const ProjectsPageComponent = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Proje verisi alınamadı:", err));
  }, []);

  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-4xl font-bold text-secondaryColor mb-2">
          Tüm Projeler
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-md">
          Aşağıda yer alan projeler, Babil Yalıtım&apos;ın gerçekleştirdiği bazı
          örnek çalışmaları göstermektedir. Her biri özenle tamamlanmış
          projelerdir.
        </p>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded mt-4"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {projects.map((project, index) => (
          <ProjectGridItem key={project._id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsPageComponent;