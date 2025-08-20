// src/components/Hero/Hero.jsx
import { useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import LinksSection from "../Links/LinksSection";
import BrandsSection from "../Brands/BrandsSection";

const Hero = ({ targetId = "after-hero" }) => {
  const linksRef = useRef(null);

  const scrollToTarget = () => {
    // Önce dışarıdaki çıpa (tercih edilen)
    const external = document.getElementById(targetId);
    const header = document.getElementById("site-navbar");
    const headerH = header ? header.offsetHeight : 0;

    if (external) {
      const rect = external.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerH - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      return;
    }

    // Fallback: içerideki LinksSection’a (desktop’ta zaten görünür)
    const el = linksRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerH - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ======== MOBILE ======== */}
      <section
        className="md:hidden relative px-3 bg-gradient-to-t from-white/10 to-transparent
                   flex flex-col min-h-[100dvh]"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      >
        {/* Başlık */}
        <div className="w-full pt-24 flex flex-col items-center text-center gap-4 px-2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <h1 className="text-[34px] xs:text-[38px] font-extrabold text-white drop-shadow-lg leading-tight">
              Yapı Korumada Uzman
            </h1>
            <p className="mt-2 text-base xs:text-lg text-gray-200">
              Babil&#39;e Hoş Geldiniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="w-14 h-1 bg-quaternaryColor rounded-full"
          />
        </div>

        {/* Markalar */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full mt-12 px-2 z-20"
        >
          <BrandsSection />
        </motion.div>

        {/* Arama + Ok – alta sabitlenen blok */}
        <div className="mt-auto w-full z-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-4xl mx-auto px-1"
          >
            <SearchBar />
          </motion.div>

          <div className="w-full flex justify-center mt-4">
            <motion.button
              onClick={scrollToTarget}
              aria-label="Aşağı kaydır"
              className="rounded-full border border-white/30 bg-white/15 backdrop-blur-xl
                         shadow-[0_6px_30px_rgba(0,0,0,0.2)] p-2.5 hover:bg-white/25 transition"
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
          </div>
        </div>

        {/* (Mobilde görünse de sorun değil) */}
        <div
          ref={linksRef}
          className="w-full flex justify-center mt-20 px-3 z-10"
        >
          <LinksSection />
        </div>
      </section>

      {/* ======== DESKTOP ======== */}
      <section className="hidden md:flex min-h-screen flex-col justify-center items-center bg-gradient-to-t from-white/10 to-transparent px-8 relative">
        <div className="container max-w-[92%] xs:max-w-[85%] sm:max-w-4xl mx-auto relative z-20 flex flex-col items-center text-center gap-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Yapı Korumada Uzman
            </h1>
            <p className="mt-2 text-xl text-gray-300">
              Babil&#39;e Hoş Geldiniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-16 h-1 bg-quaternaryColor rounded-full"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-full mt-8 px-6 relative z-20"
        >
          <BrandsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="w-full flex justify-center mt-4 z-20"
        >
          <motion.button
            onClick={scrollToTarget}
            aria-label="Aşağı kaydır"
            className="rounded-full border border-white/30 bg-white/15 backdrop-blur-xl shadow-[0_6px_30px_rgba(0,0,0,0.2)] p-3.5 hover:bg-white/25 transition"
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

        <div
          ref={linksRef}
          className="w-full flex justify-center mt-16 px-4 z-10"
        >
          <LinksSection />
        </div>
      </section>
    </>
  );
};

Hero.propTypes = {
  /** Ok tıklandığında kaydırılacak dış anchor’ın id’si */
  targetId: PropTypes.string,
};

export default Hero;
