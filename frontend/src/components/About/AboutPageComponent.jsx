// components/About/AboutPageComponent.jsx
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
      className="w-full max-w-6xl mx-auto relative text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Başlık */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-secondaryColor">
          {sections[index].title}
        </h2>
        <div className="h-1 w-20 bg-secondaryColor mx-auto mt-3 rounded-full" />
      </div>

      {/* İçerik */}
      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Görsel */}
        <AnimatePresence mode="wait">
          <motion.img
            key={sections[index].img}
            src={sections[index].img}
            alt={sections[index].title}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 h-72 object-cover rounded-2xl shadow-lg"
          />
        </AnimatePresence>

        {/* Metin */}
        <AnimatePresence mode="wait">
          <motion.p
            key={sections[index].text}
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 text-lg leading-relaxed bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm"
          >
            {sections[index].text}
          </motion.p>
        </AnimatePresence>

        {/* Navigasyon butonları */}
        <button
          onClick={prev}
          className="absolute left-0 md:-left-10 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:scale-110 transition"
        >
          ←
        </button>
        <button
          onClick={next}
          className="absolute right-0 md:-right-10 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:scale-110 transition"
        >
          →
        </button>
      </div>

      {/* Projeler butonu */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/projects")}
          className="px-8 py-3 bg-secondaryColor text-white font-semibold rounded-full shadow-md hover:bg-secondaryColor/90 transition"
        >
          Projeleri Gör
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {[
          {
            label: "Yıllık Deneyim",
            value: "10+",
            icon: <Briefcase className="w-6 h-6" />,
          },
          {
            label: "Tamamlanan Proje",
            value: "250+",
            icon: <CheckCircle className="w-6 h-6" />,
          },
          {
            label: "Memnuniyet Oranı",
            value: "%98",
            icon: <Smile className="w-6 h-6" />,
          },
          {
            label: "7/24 Destek",
            value: "Evet",
            icon: <PhoneCall className="w-6 h-6" />,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/70 backdrop-blur-lg border border-white/40 p-6 rounded-xl shadow-lg text-center hover:scale-[1.02] transition"
          >
            <div className="flex justify-center text-secondaryColor mb-2">
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-secondaryColor">
              {stat.value}
            </p>
            <p className="text-gray-700 mt-1 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutPageComponent;
