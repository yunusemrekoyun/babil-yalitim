import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Briefcase, CheckCircle, Smile, PhoneCall } from "lucide-react";
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";

const sections = [
  {
    title: "Hakkımızda",
    text: "Babil Yalıtım olarak 10 yılı aşkın süredir su yalıtımı alanında faaliyet gösteriyoruz. Tecrübemiz, uzman kadromuz ve müşteri odaklı hizmet anlayışımızla projelerinize kalıcı çözümler sunuyoruz.",
    img: img1,
  },
  {
    title: "Misyonumuz",
    text: "Her projeye özel yaklaşımımızla en kaliteli ve uzun ömürlü yalıtım hizmetini sunmak, müşteri memnuniyetini en üst seviyede tutmak.",
    img: img2,
  },
  {
    title: "Vizyonumuz",
    text: "Yalıtım sektöründe yenilikçi çözümlerle lider olmak, çevreye duyarlı ve sürdürülebilir hizmet anlayışını benimsemek.",
    img: img3,
  },
];

const AboutPageComponent = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => setIndex((prev) => (prev + 1) % sections.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + sections.length) % sections.length);

  return (
    <motion.div
      className="min-h-screen relative text-gray-800 p-6 md:p-12 space-y-6 text-center overflow-hidden bg-white/20 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/src/assets/pattern.svg')] bg-repeat"></div>

      {/* Başlık ve butonlar */}
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <button
          onClick={prev}
          className="text-2xl font-bold px-3 hover:text-secondaryColor hover:scale-110 transition"
        >
          ←
        </button>
        <h2 className="text-3xl md:text-5xl font-bold text-secondaryColor relative inline-block after:content-[''] after:block after:h-1 after:w-16 after:bg-secondaryColor after:mx-auto after:mt-2">
          {sections[index].title}
        </h2>
        <button
          onClick={next}
          className="text-2xl font-bold px-3 hover:text-secondaryColor hover:scale-110 transition"
        >
          →
        </button>
      </div>

      {/* İçerik geçişi */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 z-10 relative"
        >
          <img
            src={sections[index].img}
            alt=""
            className="w-full max-w-2xl mx-auto h-64 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-500"
          />
          <p className="text-md md:text-lg max-w-3xl mx-auto text-gray-700 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
            {sections[index].text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Projelere geç butonu */}
      <button
        onClick={() => navigate("/projects")}
        className="mt-6 inline-block px-6 py-3 border border-secondaryColor text-secondaryColor font-semibold rounded-full hover:bg-secondaryColor hover:text-white transition-all duration-300 z-10 relative"
      >
        Projeleri Gör
      </button>

      {/* İstatistik bölümü */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12 z-10 relative">
        {[
          {
            label: "Yıllık Deneyim",
            value: "10+",
            icon: <Briefcase className="text-secondaryColor w-6 h-6" />,
          },
          {
            label: "Tamamlanan Proje",
            value: "250+",
            icon: <CheckCircle className="text-secondaryColor w-6 h-6" />,
          },
          {
            label: "Memnuniyet Oranı",
            value: "%98",
            icon: <Smile className="text-secondaryColor w-6 h-6" />,
          },
          {
            label: "7/24 Destek",
            value: "Evet",
            icon: <PhoneCall className="text-secondaryColor w-6 h-6" />,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/20 border border-white/30 p-6 rounded-xl backdrop-blur-md shadow-md hover:bg-white/30 hover:shadow-lg transition-all duration-300 cursor-default"
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-3xl font-bold text-secondaryColor">
              {stat.value}
            </p>
            <p className="text-black mt-2 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutPageComponent;