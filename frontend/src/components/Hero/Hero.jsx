import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import LinksSection from "../Links/LinksSection";

const Hero = () => {
  return (
    <>
      <section className="min-h-[700px] flex justify-center items-center bg-gradient-to-t from-brandDark from-2% to-transparent to-15% h-full relative px-4 sm:px-8">
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 0, 0, 0.3) 50%, rgba(11, 11, 13, 0.5) 70%, rgba(11, 11, 13, 0.8) 90%)",
          }}
        ></div>

        <div className="container relative z-20 flex flex-col items-center text-center space-y-6">
          {/* Başlık */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              Su Yalıtımında <span className="text-green-400">Uzmanız</span>
            </h1>
            <p className="mt-2 text-md md:text-lg text-gray-300">
              En kaliteli yalıtım çözümleri için aramaya başlayın.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-16 h-1 bg-green-400 rounded-full"
          ></motion.div>

          {/* SearchBar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="w-full max-w-xl mx-auto backdrop-blur-md bg-white/5 p-5 rounded-xl shadow-md"
          >
            <SearchBar />
          </motion.div>

          {/* Linkler (Alt Butonlar) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full max-w-xl mx-auto"
          >
            <LinksSection />
          </motion.div>
        </div>

        {/* Scroll oku */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-gray-400 text-2xl"
        >
          ↓
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
