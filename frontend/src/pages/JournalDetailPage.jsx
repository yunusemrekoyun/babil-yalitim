// src/pages/JournalDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import GlassSection from "../components/Layout/GlassSection";
import JournalDetail from "../components/Journal/JournalDetail";
import api from "../api"; // ← senin axios instance'ın

const JournalDetailPage = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

useEffect(() => {
  if (!id) return;

  api.get(`/journals/${id}`)
    .then((res) => {
      setJournal(res.data);
      setNotFound(false);       // haber bulundu
    })
    .catch((err) => {
      console.error("Journal bulunamadı:", err);
      setJournal(null);
      setNotFound(true);        // haber bulunamadı
    })
    .finally(() => {
      setLoading(false);        // yükleme tamamlandı
    });
}, [id]);

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
            {loading ? (
              <div className="text-center text-lg text-gray-700">Yükleniyor...</div>
            ) : notFound ? (
              <div className="text-center text-lg text-red-500">Haber bulunamadı.</div>
            ) : (
              <JournalDetail journal={journal} />
            )}
          </GlassSection>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default JournalDetailPage;