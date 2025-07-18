// src/pages/JournalDetailPage.jsx
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import GlassSection from "../components/Layout/GlassSection";
import JournalDetail from "../components/Journal/JournalDetail";
import Img1 from "../assets/banner.png";

const dummyData = [
  {
    id: "1",
    title: "Su Yalıtımında Doğru Malzeme Seçimi",
    about:
      "Su yalıtımı, yapıların ömrünü uzatmak için hayati öneme sahiptir. Bu yazımızda hangi yalıtım malzemesinin hangi yüzeylerde daha verimli olduğunu inceliyoruz.",
    date: "14 Temmuz 2025",
    image: Img1,
  },
  {
    id: "2",
    title: "Isı Yalıtımı ile Enerji Tasarrufu",
    about:
      "Doğru uygulanan ısı yalıtımı, hem konforunuzu artırır hem de enerji faturalarınızı azaltır. Bu blogda, farklı ısı yalıtım sistemlerini ve avantajlarını ele alıyoruz.",
    date: "10 Temmuz 2025",
    image: Img1,
  },
];

const JournalDetailPage = () => {
  const { id } = useParams();
  const journal = dummyData.find((item) => item.id === id);

  if (!journal) {
    return <div className="text-center py-20 text-xl">Haber bulunamadı.</div>;
  }

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
            <JournalDetail journal={journal} />
          </GlassSection>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default JournalDetailPage;