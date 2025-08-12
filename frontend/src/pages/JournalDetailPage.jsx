import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import JournalDetail from "../components/Journal/JournalDetail";

const JournalDetailPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-orange-100"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarPage />
        <JournalDetail />
      </motion.div>
      <Footer />
    </>
  );
};

export default JournalDetailPage;
