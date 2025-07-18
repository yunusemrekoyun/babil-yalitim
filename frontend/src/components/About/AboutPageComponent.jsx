// components/About/AboutPageComponent.jsx

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Footer from "../Footer/Footer";
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
    <div className="text-gray-800 p-6 md:p-12 space-y-6 text-center">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prev} className="text-2xl font-bold px-3">
          ←
        </button>
        <h2 className="text-3xl md:text-5xl font-bold text-secondaryColor">
          {sections[index].title}
        </h2>
        <button onClick={next} className="text-2xl font-bold px-3">
          →
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <img
            src={sections[index].img}
            alt=""
            className="w-full max-w-2xl mx-auto h-64 object-cover rounded-xl shadow-md"
          />
          <p className="text-md md:text-lg max-w-3xl mx-auto text-gray-700">
            {sections[index].text}
          </p>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => navigate("/projects")}
        className="mt-6 inline-block px-6 py-3 border border-secondaryColor text-secondaryColor font-semibold rounded-full hover:bg-secondaryColor hover:text-white transition-all duration-300"
      >
        Projeleri Gör
      </button>

      {/* İstatistik Bölümü */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {[
          { label: "Yıllık Deneyim", value: "10+" },
          { label: "Tamamlanan Proje", value: "250+" },
          { label: "Memnuniyet Oranı", value: "%98" },
          { label: "7/24 Destek", value: "Evet" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md shadow-md 
      transition-all duration-300 hover:bg-white/20 hover:shadow-lg cursor-default"
          >
            <p className="text-3xl font-bold text-secondaryColor">
              {stat.value}
            </p>
            <p className="text-black-100 mt-2 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPageComponent;
