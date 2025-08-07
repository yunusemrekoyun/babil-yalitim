import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logo.png";

// Tüm navbar animasyonu (tek seferde animasyon)
const SlideAllIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

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

const NavbarPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full z-30 relative">
      {/* ✅ Masaüstü navbar */}
      <motion.nav
        className="hidden md:flex container mx-auto justify-between items-center py-4 md:py-6 uppercase font-semibold text-xs md:text-lg text-neutral-800"
        variants={SlideAllIn}
        initial="hidden"
        animate="visible"
      >
        {/* Sol 3 buton */}
        <div className="flex gap-4">
          <a href="/about" className="px-4 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">Hakkımızda</a>
          <a href="/projects" className="px-4 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">Projeler</a>
          <a href="/services" className="px-4 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">Hizmetler</a>
        </div>

        {/* Logo */}
        <a href="/">
          <img src={Logo} alt="Logo" className="w-[200px]" />
        </a>

        {/* Sağ 3 buton */}
        <div className="flex gap-4">
          <a href="/blog" className="px-4 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">Blog</a>
          <a href="/journal" className="px-4 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">Haberler</a>
          <a href="/iletisim" className="px-4 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">İletişim</a>
        </div>
      </motion.nav>

      {/* ✅ Mobil navbar */}
      <div className="md:hidden px-4 py-3 flex justify-between items-center bg-white text-neutral-800 border-b border-gray-300">
        <a href="/">
          <img src={Logo} alt="Logo" className="h-10" />
        </a>
        <button onClick={() => setIsOpen(!isOpen)} className="z-50">
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
            className="absolute top-0 left-0 right-0 bg-white text-neutral-800 flex flex-col items-center gap-4 py-6 z-40 border-b border-gray-300"
          >
            <a href="/about" onClick={() => setIsOpen(false)} className="text-lg uppercase">Hakkımızda</a>
            <a href="/projects" onClick={() => setIsOpen(false)} className="text-lg uppercase">Projeler</a>
            <a href="/services" onClick={() => setIsOpen(false)} className="text-lg uppercase">Hizmetler</a>
            <a href="/blog" onClick={() => setIsOpen(false)} className="text-lg uppercase">Blog</a>
            <a href="/journal" onClick={() => setIsOpen(false)} className="text-lg uppercase">Haberler</a>
            <a href="/iletisim" onClick={() => setIsOpen(false)} className="text-lg uppercase">İletişim</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarPage;