import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import JournalPreview from "../components/Journal/JournalPreview";
import api from "../api";

const JournalPage = () => {
  const [journalData, setJournalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/journals")
      .then((res) => setJournalData(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Journal verisi alınamadı:", err))
      .finally(() => setLoading(false));
  }, []);

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

        {/* Hero şerit */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_top,rgba(25,89,115,0.35),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-10">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl md:text-5xl font-bold text-secondaryColor text-center"
            >
              Haberler
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-4 text-center text-gray-600 max-w-2xl mx-auto"
            >
              Sektörden gelişmeler, firma duyuruları ve teknik içerikleri burada
              topluyoruz.
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="h-1 w-24 bg-quaternaryColor/90 rounded-full mx-auto mt-6 origin-left"
            />
          </div>
        </section>

        {/* İçerik */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <JournalPreview data={journalData} loading={loading} />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default JournalPage;
