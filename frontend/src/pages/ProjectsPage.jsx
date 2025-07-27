import { motion } from "framer-motion";
import GlassSection from "../components/Layout/GlassSection";
import ProjectsPageComponent from "../components/ProjeGrid/ProjectsPageComponent";
import Footer from "../components/Footer/Footer";
import NavbarPage from "../components/Navbar/NavbarPage";

const ProjectsPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-orange-500 via-gray-100 to-orange-300 p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavbarPage />

        <div className="px-4 py-16 flex flex-col items-center justify-center space-y-8">
          <GlassSection>
            <ProjectsPageComponent />
          </GlassSection>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default ProjectsPage;
