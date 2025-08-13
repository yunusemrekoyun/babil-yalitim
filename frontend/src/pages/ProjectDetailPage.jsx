// src/pages/ProjectDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import ProjectDetail from "../components/ProjeGrid/ProjectDetail";
import Breadcrumb from "../components/ui/Breadcrumb";
import api from "../api";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/projects/${id}`).then(({ data }) => {
      setProjectTitle(data?.title || "");
    });
  }, [id]);

  return (
    <>
      <NavbarPage />

      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Breadcrumb
          titleMap={{
            "project-detail": "Projelerimiz",
            projects: "Projelerimiz",
            [id]: projectTitle || "Yükleniyor...",
          }}
          nonLinkLabels={["Projelerimiz"]} // 👈 bu etiket link değil
        />
      </section>

      <ProjectDetail />
      <Footer />
    </>
  );
};

export default ProjectDetailPage;
