import Img1 from "../../assets/banner.png";
import Img2 from "../../assets/banner.png";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const JournalData = [
  {
    id: 1,
    title: "Su Yalıtımında Doğru Malzeme Seçimi",
    about:
      "Su yalıtımı, yapıların ömrünü uzatmak için hayati öneme sahiptir. Bu yazımızda hangi yalıtım malzemesinin hangi yüzeylerde daha verimli olduğunu inceliyoruz.",
    date: "14 Temmuz 2025",
    url: "#",
    image: Img1,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Isı Yalıtımı ile Enerji Tasarrufu",
    about:
      "Doğru uygulanan ısı yalıtımı, hem konforunuzu artırır hem de enerji faturalarınızı azaltır. Bu blogda, farklı ısı yalıtım sistemlerini ve avantajlarını ele alıyoruz.",
    date: "10 Temmuz 2025",
    url: "#",
    image: Img2,
    delay: 0.4,
  },
];

const Journal = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 });
  const navigate = useNavigate();

  return (
    <section
      className="w-full text-white py-20 px-6 relative"
      id="journal"
      ref={ref}
    >
      {/* header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Haberler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded mb-6"></div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We are all explorers, driven by curiosity and the desire to discover
          new horizons. Join us on a journey to uncover the wonders of our
          planet.
        </p>
      </div>

      {/* cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center mt-20">
        {JournalData.map((data) => (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 0.6, delay: data.delay }}
            key={data.id}
            className="bg-secondaryColor rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={data.image}
              alt=""
              className="w-full h-[350px] object-cover"
            />
            <div className="space-y-2 py-6 px-6 text-center">
              <p className="uppercase text-sm text-green-300">{data.date}</p>
              <p className="text-xl font-semibold">{data.title}</p>
              <p className="text-gray-300 mt-4">{data.about}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sağ alt köşe linki */}
      {/* Sağ alt köşe butonu */}
      <motion.div
        key={inView ? "visible" : "hidden"} // Her girişte key değişir ve animasyon tetiklenir
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-6 right-6 z-20"
      >
        <button
          onClick={() => navigate("/journal")}
          className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
            px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 transition-all duration-300"
        >
          Journal&apos;ın devamı için...
          <FiArrowRight className="text-lg" />
        </button>
      </motion.div>
    </section>
  );
};

export default Journal;
