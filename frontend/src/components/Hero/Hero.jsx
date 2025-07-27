import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import LinksSection from "../Links/LinksSection";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-t from-white/10 to-transparent px-4 sm:px-8 relative">
      <div className="container max-w-4xl mx-auto relative z-20 flex flex-col items-center text-center space-y-6 px-4">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            Yapı Korumada Uzman
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-xl text-gray-300">
            Babil&#39;e Hoş Geldiniz.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-12 sm:w-16 h-1 bg-quaternaryColor rounded-full"
        ></motion.div>

        {/* SearchBar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="w-full"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Linkler */}
      <div className="w-full flex justify-center mt-10 sm:mt-16 px-4 z-20">
        <LinksSection />
      </div>

      {/* Scroll oku */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-gray-400 text-xl sm:text-2xl"
      >
        ↓
      </motion.div>
    </section>
  );
};

export default Hero;