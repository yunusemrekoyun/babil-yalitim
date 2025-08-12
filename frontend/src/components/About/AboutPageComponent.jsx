// components/About/AboutPageComponent.jsx
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Smile,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";

const sections = [
  {
    title: "Hakkımızda",
    text: "Babil Yalıtım olarak 10 yılı aşkın süredir su yalıtımı alanında faaliyet gösteriyoruz. Tecrübemiz, uzman kadromuz ve müşteri odaklı yaklaşımımızla projelerinize kalıcı çözümler sunuyoruz.",
    img: img1,
  },
  {
    title: "Misyonumuz",
    text: "Her projeye özel yaklaşımımızla en kaliteli ve uzun ömürlü yalıtım hizmetini sunmak; güven, şeffaflık ve memnuniyeti merkeze almak.",
    img: img2,
  },
  {
    title: "Vizyonumuz",
    text: "Yalıtım sektöründe yenilikçi ve sürdürülebilir çözümlerle lider olmak; çevreye duyarlı bir üretim ve uygulama kültürünü yaygınlaştırmak.",
    img: img3,
  },
];

const cardFx = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const AboutPageComponent = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => setIndex((p) => (p + 1) % sections.length);
  const prev = () =>
    setIndex((p) => (p - 1 + sections.length) % sections.length);

  const s = sections[index];

  return (
    <div className="w-full space-y-10">
      {/* Ana içerik kartı: ortak “glass” dilinde */}
      <motion.div
        variants={cardFx}
        initial="hidden"
        animate="show"
        className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Görsel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={s.img}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={s.img}
                alt={s.title}
                className="w-full h-72 md:h-[380px] object-cover"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>

          {/* Metin */}
          <AnimatePresence mode="wait">
            <motion.div
              key={s.text}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45 }}
              className="space-y-3"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold text-secondaryColor">
                {s.title}
              </h2>
              <div className="h-[3px] w-16 bg-quaternaryColor rounded-full" />
              <p className="text-gray-700 leading-relaxed">{s.text}</p>

              {/* CTA */}
              <div className="pt-2">
                <button
                  onClick={() => navigate("/projects")}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm text-white bg-quaternaryColor hover:bg-opacity-90 transition-shadow hover:shadow-lg"
                >
                  Projeleri Gör
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigasyon & göstergeler */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {sections.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-quaternaryColor" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="inline-flex items-center justify-center rounded-full bg-white border px-3 py-2 hover:bg-gray-50"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="inline-flex items-center justify-center rounded-full bg-white border px-3 py-2 hover:bg-gray-50"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* İstatistikler — ortak rozet stili */}
      <motion.div
        variants={cardFx}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
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
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 p-6 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-center text-secondaryColor mb-2">
              {stat.icon}
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-secondaryColor">
              {stat.value}
            </p>
            <p className="text-gray-700 mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AboutPageComponent;
