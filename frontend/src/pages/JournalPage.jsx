import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import GlassSection from "../components/Layout/GlassSection";
import JournalPreview from "../components/Journal/JournalPreview";
import api from "../api"; // API bağlantısı

const JournalPage = () => {
  const [journalData, setJournalData] = useState([]);

  useEffect(() => {
    api
      .get("/journals")
      .then((res) => setJournalData(res.data))
      .catch((err) => console.error("Journal verisi alınamadı:", err));
  }, []);

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-orange-500 via-gray-100 to-orange-300"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavbarPage />

        <div className="px-4 py-20 flex flex-col items-center justify-center space-y-8">
          <GlassSection>
            <div className="w-full px-4 md:px-10 py-10">
              <h2 className="text-4xl font-bold text-secondaryColor text-center">
                Haberler
              </h2>
              <div className="h-1 w-20 bg-quaternaryColor mx-auto my-4 rounded-full"></div>

              <JournalPreview data={journalData} />
            </div>
          </GlassSection>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default JournalPage;