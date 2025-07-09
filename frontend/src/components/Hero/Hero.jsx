import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import LinksSection from "../Links/LinksSection";

const Hero = () => {
  return (
    <>
      <section className="min-h-[900px] flex justify-center items-center bg-gradient-to-t from-brandDark from-2% to-transparent to-15% h-full">
        {/* radial gradient section */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 0, 0, 0.3) 50%, rgba(11, 11, 13, 0.5) 70%, rgba(11, 11, 13, 0.8) 90%)",
          }}
        ></div>

        {/* Hero Content: sadece SearchBar ve LinksSection ortada */}
        <div className="container relative z-20 flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="w-full max-w-xl mx-auto"
          >
            <SearchBar />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="w-full max-w-xl mx-auto"
          >
            <LinksSection />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
