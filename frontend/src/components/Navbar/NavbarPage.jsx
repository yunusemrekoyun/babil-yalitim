import Logo from "../../assets/logo.png";
import { motion } from "framer-motion";

const SlideBottom = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  },
});

const NavbarPage = () => {
  return (
    <header className="w-full shadow-sm z-20 relative bg-transparent">
      <nav className="container mx-auto flex justify-around items-center py-4 md:py-6 uppercase font-semibold text-xs md:text-lg text-neutral-800 relative z-10">

        {/* Hakkımızda */}
        <motion.a
          variants={SlideBottom(0)}
          initial="hidden"
          animate="visible"
          href="/about"
          className="px-4 py-2 rounded-full border border-gray-500 text-gray-800 hover:bg-gray-100 transition"
        >
          Hakkımızda
        </motion.a>

        {/* Projeler */}
        <motion.a
          variants={SlideBottom(0.2)}
          initial="hidden"
          animate="visible"
          href="/projects"
          className="px-4 py-2 rounded-full border border-gray-500 text-gray-800 hover:bg-gray-100 transition"
        >
          Projeler
        </motion.a>

        {/* Logo */}
        <motion.a
          variants={SlideBottom(0.4)}
          initial="hidden"
          animate="visible"
          href="/"
        >
          <img src={Logo} alt="Logo" className="w-[250px] md:w-[250px]" />
        </motion.a>

        {/* Hizmetler */}
        <motion.a
          variants={SlideBottom(0.6)}
          initial="hidden"
          animate="visible"
          href="/services"
          className="px-4 py-2 rounded-full border border-gray-500 text-gray-800 hover:bg-gray-100 transition"
        >
          Hizmetler
        </motion.a>

        {/* Blog */}
        <motion.a
          variants={SlideBottom(0.8)}
          initial="hidden"
          animate="visible"
          href="/blog"
          className="px-4 py-2 rounded-full border border-gray-500 text-gray-800 hover:bg-gray-100 transition"
        >
          Blog
        </motion.a>

      </nav>
    </header>
  );
};

export default NavbarPage;