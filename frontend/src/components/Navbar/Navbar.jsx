import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logo.png";

const SlideBottom = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  },
});

const topBarVariants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full z-30 relative">
      {/* Masaüstü navbar */}
      <nav className="hidden md:flex container mx-auto justify-around items-center py-4 md:py-6 uppercase font-semibold text-xs md:text-lg text-white">
        <motion.a variants={SlideBottom(0)} initial="hidden" animate="visible" href="/about" className="px-4 py-2 rounded-full border border-white/80 hover:bg-white/10 transition">Hakkımızda</motion.a>
        <motion.a variants={SlideBottom(0.2)} initial="hidden" animate="visible" href="/projects" className="px-4 py-2 rounded-full border border-white/80 hover:bg-white/10 transition">Projeler</motion.a>
        <motion.a variants={SlideBottom(0.4)} initial="hidden" animate="visible" href="/">
          <img src={Logo} alt="Logo" className="w-[250px]" />
        </motion.a>
        <motion.a variants={SlideBottom(0.6)} initial="hidden" animate="visible" href="/services" className="px-4 py-2 rounded-full border border-white/80 hover:bg-white/10 transition">Hizmetler</motion.a>
        <motion.a variants={SlideBottom(0.8)} initial="hidden" animate="visible" href="/blog" className="px-4 py-2 rounded-full border border-white/80 hover:bg-white/10 transition">Blog</motion.a>
      </nav>

      {/* Mobil navbar */}
      <div className="md:hidden px-4 py-3 flex justify-between items-center bg-black/60 text-white">
        <a href="/">
          <img src={Logo} alt="Logo" className="h-10" />
        </a>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white z-50">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Açılır TopBar Menü */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={topBarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 right-0 bg-black text-white flex flex-col items-center gap-4 py-6 z-40"
          >
            <a href="/about" onClick={() => setIsOpen(false)} className="text-lg uppercase">Hakkımızda</a>
            <a href="/projects" onClick={() => setIsOpen(false)} className="text-lg uppercase">Projeler</a>
            <a href="/services" onClick={() => setIsOpen(false)} className="text-lg uppercase">Hizmetler</a>
            <a href="/blog" onClick={() => setIsOpen(false)} className="text-lg uppercase">Blog</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;