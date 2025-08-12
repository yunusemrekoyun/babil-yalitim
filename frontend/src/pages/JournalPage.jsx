import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import JournalPreview from "../components/Journal/JournalPreview";
import api from "../api";

const JournalPage = () => {
  const [journalData, setJournalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/journals");
        if (!cancelled) {
          setJournalData(Array.isArray(res.data) ? res.data : []);
        }
      } catch (e) {
        console.error("Journal verisi alınamadı:", e?.response?.data || e);
        if (!cancelled) setErr("Haberler getirilemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-8">
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

        {/* İçerik + Arama */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <JournalPreview data={journalData} loading={loading} error={err} />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default JournalPage;
