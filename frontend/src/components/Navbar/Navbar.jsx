import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logo.png";

// Animasyonlar
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinksLeft = [
    { label: "Hakkımızda", href: "/about" },
    { label: "Projeler", href: "/projects" },
    { label: "Hizmetler", href: "/services" },
  ];

  const navLinksRight = [
    { label: "Blog", href: "/blog" },
    { label: "Haberler", href: "/journal" },
    { label: "İletişim", href: "/iletisim" },
  ];

  return (
    <header className="w-full z-30 relative">
      {/* ✅ Masaüstü navbar */}
      <motion.nav
        className="hidden md:flex container mx-auto justify-between items-center py-4 md:py-6 uppercase font-semibold text-xs md:text-lg text-white"
        variants={SlideAllIn}
        initial="hidden"
        animate="visible"
      >
        {/* Sol linkler */}
        <div className="flex gap-4">
          {navLinksLeft.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`w-[150px] text-center px-4 py-2 rounded-full transition ${
                location.pathname === item.href
                  ? "bg-white text-black"
                  : "border border-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Logo */}
        <a href="/">
          <img src={Logo} alt="Logo" className="w-[200px]" />
        </a>

        {/* Sağ linkler */}
        <div className="flex gap-4">
          {navLinksRight.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`w-[140px] text-center px-4 py-2 rounded-full transition ${
                location.pathname === item.href
                  ? "bg-white text-black"
                  : "border border-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ✅ Mobil navbar */}
      <div className="md:hidden px-4 py-3 flex justify-between items-center bg-black/60 text-white">
        <a href="/">
          <img src={Logo} alt="Logo" className="h-10" />
        </a>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white z-50">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Açılır Mobil Menü */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={topBarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 right-0 bg-black text-white flex flex-col items-center gap-4 py-6 z-40"
          >
            {[...navLinksLeft, ...navLinksRight].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-[140px] text-center py-2 text-lg uppercase rounded-full transition ${
                  location.pathname === item.href
                    ? "bg-white text-black"
                    : "border border-white/60 hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;