import { useRef } from "react";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import LinksSection from "../Links/LinksSection";
import BrandsSection from "../Brands/BrandsSection";

const Hero = () => {
  const linksRef = useRef(null);

  const scrollToLinks = () => {
    const el = linksRef.current;
    if (!el) return;
    const HEADER_OFFSET = 70; // sticky navbar varsa
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    // Mobilde daha uzun tut (90svh), desktop aynı
    <section className="min-h-[90svh] md:min-h-screen flex flex-col justify-center items-center bg-gradient-to-t from-white/10 to-transparent px-3 sm:px-8 relative">
      {/* Başlık + Divider + Search */}
      <div className="container max-w-[92%] xs:max-w-[85%] sm:max-w-4xl mx-auto relative z-20 flex flex-col items-center text-center gap-4 sm:gap-6 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-[28px] xs:text-[32px] sm:text-5xl font-bold text-white drop-shadow-lg">
            Yapı Korumada Uzman
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-xl text-gray-300">
            Babil&#39;e Hoş Geldiniz.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-10 sm:w-16 h-1 bg-quaternaryColor rounded-full"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="w-full"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Markalar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="w-full mt-4 sm:mt-8 px-3 sm:px-6 md:px-8 relative z-20"
      >
        <BrandsSection />
      </motion.div>

      {/* Scroll oku – MOBİLDE biraz daha aşağıda */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="w-full flex justify-center mt-1 sm:mt-1 z-20"
      >
        <motion.button
          onClick={scrollToLinks}
          aria-label="Aşağı kaydır"
          className="rounded-full border border-white/30 bg-white/15 backdrop-blur-xl shadow-[0_6px_30px_rgba(0,0,0,0.2)] p-2.5 sm:p-3.5 hover:bg-white/25 transition-all duration-200"
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.6,
            ease: "easeInOut",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-white/90"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* Linkler – MOBİLDE ekranda görünmesin diye daha fazla üst marj */}
      <div
        ref={linksRef}
        className="w-full flex justify-center mt-24 sm:mt-16 px-3 sm:px-4 z-10"
      >
        <LinksSection />
      </div>
    </section>
  );
};

export default Hero;
