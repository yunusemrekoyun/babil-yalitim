import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import ServicePageComponent from "../components/Service/ServicePageComponent";

const SerivcePage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <NavbarPage />

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
          <ServicePageComponent />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default SerivcePage;
