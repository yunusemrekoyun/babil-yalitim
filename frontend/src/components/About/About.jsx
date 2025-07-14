import img1 from "../../assets/about.jpg";
import { Users, CheckCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="relative w-full text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Sol: Görsel */}
        <div className="rounded-xl overflow-hidden shadow-lg max-h-[450px]">
          <img
            src={img1}
            alt="Yalıtım uygulaması"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Sağ: İçerik */}
        <div className="bg-secondaryColor p-8 rounded-xl shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hakkımızda</h2>
          <div className="h-1 w-20 bg-quaternaryColor mb-6 rounded"></div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Firmamız 2013 yılından beri Kütahya’da su yalıtımı üzerine hizmet
            vermektedir. Temel izolasyonu, perde beton izolasyonu, PVC
            geomembran uygulama, teras ve çatı izolasyonu, havuz ve ıslak zemin
            izolasyonu, depo izolasyonu, poliüretan köpük uygulamaları, polyurea
            kaplama ve enjeksiyon sistemleri alanlarında profesyonel çözümler
            sunmaktayız.
          </p>

          {/* Sayısal Bilgiler */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-tertiaryColor p-4 rounded">
              <Users className="text-quaternaryColor w-6 h-6" />
              <div>
                <div className="text-xl font-bold text-quaternaryColor">
                  1234
                </div>
                <div className="text-sm text-quaternaryColor">
                  Mutlu Müşteri
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-tertiaryColor p-4 rounded">
              <CheckCircle className="text-quaternaryColor w-6 h-6" />
              <div>
                <div className="text-xl font-bold text-quaternaryColor">
                  1234
                </div>
                <div className="text-sm text-quaternaryColor">
                  Tamamlanan Proje
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ alt köşe butonu */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="absolute bottom-6 right-6 z-40"
      >
        <a
          href="/about"
          className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
      px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 
      transition-all duration-300"
        >
          Daha Fazlasını Keşfedin
          <ChevronRight size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default About;
