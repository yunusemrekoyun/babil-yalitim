import Logo from "../../assets/logo.png";
import { SlideBottom } from "../../utility/animation";
import { motion } from "framer-motion";
import heroVideo from "../../assets/hero.mp4";

const Navbar = () => {
  return (
    <header className="w-full shadow-sm z-20 relative bg-transparent">
      <nav className="container mx-auto flex justify-around items-center py-4 md:py-6 uppercase font-semibold text-xs md:text-lg text-white relative z-10">
        <motion.a
          variants={SlideBottom(0)}
          initial="hidden"
          animate="visible"
          href="#about"
          className="hover:text-quaternaryColor transition"
        >
          About
        </motion.a>

        <motion.a
          variants={SlideBottom(0.2)}
          initial="hidden"
          animate="visible"
          href="#explore"
          className="hover:text-quaternaryColor transition"
        >
          Explore
        </motion.a>

        <motion.a
          variants={SlideBottom(0.4)}
          initial="hidden"
          animate="visible"
          href="#"
        >
          <img src={Logo} alt="Logo" className="w-[180px] md:w-[250px]" />
        </motion.a>

        <motion.a
          variants={SlideBottom(0.6)}
          initial="hidden"
          animate="visible"
          href="#journal"
          className="hover:text-quaternaryColor transition"
        >
          Journal
        </motion.a>

        <motion.a
          variants={SlideBottom(0.8)}
          initial="hidden"
          animate="visible"
          href="#search"
          className="hover:text-quaternaryColor transition"
        >
          Search
        </motion.a>
      </nav>
    </header>
  );
};

export default Navbar;
