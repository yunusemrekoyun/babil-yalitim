import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import GlassSection from "../components/Layout/GlassSection";
import JournalPreview from "../components/Journal/JournalPreview";
import Img1 from "../assets/banner.png";
import Img2 from "../assets/banner.png";

const journalData = [
  {
    id: 1,
    title: "Su Yalıtımında Doğru Malzeme Seçimi",
    about:
      "Su yalıtımı, yapıların ömrünü uzatmak için hayati öneme sahiptir. Bu yazımızda hangi yalıtım malzemesinin hangi yüzeylerde daha verimli olduğunu inceliyoruz.",
    date: "14 Temmuz 2025",
    image: Img1,
  },
  {
    id: 2,
    title: "Isı Yalıtımı ile Enerji Tasarrufu",
    about:
      "Doğru uygulanan ısı yalıtımı, hem konforunuzu artırır hem de enerji faturalarınızı azaltır. Bu blogda, farklı ısı yalıtım sistemlerini ve avantajlarını ele alıyoruz.",
    date: "10 Temmuz 2025",
    image: Img2,
  },
];

const JournalPage = () => {
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
            <div className="w-full px-4 md:px-10 py-6">
              <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor text-center">
                Haberler
              </h2>
              <div className="h-1 w-20 bg-quaternaryColor mx-auto my-4 rounded-full"></div>

              <JournalPreview data={journalData} />
            </div>
          </GlassSection>
        </div>a
      </motion.div>

      <Footer />
    </>
  );
};

export default JournalPage;
