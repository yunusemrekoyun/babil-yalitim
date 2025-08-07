import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import Contact from "../components/Contact/Contact";

const ContactPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-orange-500 via-gray-100 to-orange-300 p-6 md:p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavbarPage />
        <Contact />
      </motion.div>

      <Footer />
    </>
  );
};

export default ContactPage;