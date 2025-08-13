import {
  CheckCircle,
  Users,
  Search,
  Headphones,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: CheckCircle,
    title: "Kaliteli Hizmet",
    desc: "Uzun ömürlü, garantili ve ölçülebilir performans.",
  },
  {
    icon: Users,
    title: "Uzman Kadro",
    desc: "Saha deneyimi yüksek, sertifikalı uygulama ekipleri.",
  },
  {
    icon: Search,
    title: "Ücretsiz Keşif",
    desc: "Yerinde inceleme + net fiyat ve takvim planı.",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    desc: "Uygulama sonrası bakım ve danışmanlık.",
  },
];

const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.4, ease: "easeOut" },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WhyUs = () => {
  return (
    <section className="relative w-full py-16 md:py-20 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Başlık */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondaryColor">
            Neden <span className="text-quaternaryColor">Babil</span> Yalıtım?
          </h2>
          <div className="h-1 w-24 bg-quaternaryColor/90 rounded-full mx-auto mt-4" />
          <p className="mt-4 text-sm md:text-base text-white/90 max-w-3xl mx-auto">
            10+ yıllık deneyim, doğru malzeme ve doğru uygulamayla değer
            üretiyoruz.
          </p>
        </div>

        {/* Özellikler */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              className="group rounded-2xl border border-white/40 bg-white/25 backdrop-blur-xl
                         shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 md:p-6 flex gap-4 items-start
                         hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition"
            >
              <div className="flex-shrink-0 rounded-xl bg-quaternaryColor/90 p-3 text-white shadow">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold text-white">
                  {title}
                </h4>
                <p className="mt-1 text-sm text-gray-200/90">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA satırı – absolute yerine akış içinde (taşma/çakışma yok) */}
        {/* CTA satırı */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="mt-8 md:mt-10 flex justify-center"
        >
          <a
            href="/whyus"
            className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
      px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg 
      hover:bg-white/20 transition-all duration-300"
          >
            Daha fazlası
            <ChevronRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
