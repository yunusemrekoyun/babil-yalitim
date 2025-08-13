// pages/AboutPage.jsx
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import AboutPageComponent from "../components/About/AboutPageComponent";
import Breadcrumb from "../components/ui/Breadcrumb"; // yeni ekleme

const AboutPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-orange-50"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarPage />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6">
          <Breadcrumb titleMap={{ about: "Hakkımızda" }} />
        </div>

        {/* Hero / ortak başlık şeridi */}
        <header className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-secondaryColor tracking-tight text-center">
              Hakkımızda
            </h1>
            <div className="h-1 w-24 bg-quaternaryColor/90 rounded-full mt-4 mx-auto" />
            <p className="mt-6 text-gray-700 max-w-2xl mx-auto text-center">
              2013’ten bu yana su yalıtımı ve yapı koruma çözümlerinde
              süreklilik, kalite ve güven.
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-8">
          <AboutPageComponent />
        </main>
      </motion.div>

      <Footer />
    </>
  );
};

export default AboutPage;
