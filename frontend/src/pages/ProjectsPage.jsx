import { motion } from "framer-motion";
import ProjectsPageComponent from "../components/ProjeGrid/ProjectsPageComponent";
import Footer from "../components/Footer/Footer";
import NavbarPage from "../components/Navbar/NavbarPage";

const ProjectsPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-orange-100 to-white"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarPage />

        {/* Hero Header */}
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-quaternaryColor/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-[320px] h-[320px] rounded-full bg-secondaryColor/10 blur-3xl" />

          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-18">
            <h1 className="text-3xl md:text-5xl font-extrabold text-secondaryColor tracking-tight">
              Projelerimiz
            </h1>
            <div className="h-1 w-24 bg-quaternaryColor rounded-full mt-4" />
            <p className="mt-6 text-gray-700 max-w-2xl">
              Gerçekleştirdiğimiz çalışmalardan seçkiler. Kalite, süreklilik ve
              estetikten ödün vermeden ürettiğimiz çözümler.
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-10">
          <ProjectsPageComponent />
        </main>
      </motion.div>

      <Footer />
    </>
  );
};

export default ProjectsPage;
