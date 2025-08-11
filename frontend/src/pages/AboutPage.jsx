// pages/AboutPage.jsx
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import AboutPageComponent from "../components/About/AboutPageComponent";

const AboutPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-orange-200 via-white to-orange-100 p-6 md:p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavbarPage />

        <div className="px-4 py-12 flex flex-col items-center justify-center space-y-8">
          <AboutPageComponent />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default AboutPage;
