import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logo.png";

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
    y: "0%", opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    y: "-100%", opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const navItems = [
  { label: "Hakkımızda", path: "/about" },
  { label: "Projeler", path: "/projects" },
  { label: "Hizmetler", path: "/services" },
  { label: "Blog", path: "/blog" },
  { label: "Haberler", path: "/journal" },
  { label: "İletişim", path: "/iletisim" },
];

const NavbarPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full z-30 relative">
      {/* ✅ Masaüstü */}
      <motion.nav
        className="hidden md:flex container mx-auto justify-between items-center py-4 md:py-6 uppercase font-semibold text-xs md:text-lg text-neutral-800"
        variants={SlideAllIn}
        initial="hidden"
        animate="visible"
      >
        {/* Sol butonlar */}
        <div className="flex gap-2">
          {navItems.slice(0, 3).map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`w-150px] text-center px-4 py-2 rounded-full transition
                ${
                  location.pathname === item.path
                    ? "bg-white text-black"
                    : "border border-gray-500 hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Logo */}
        <a href="/">
          <img src={Logo} alt="Logo" className="w-[200px]" />
        </a>

        {/* Sağ butonlar */}
        <div className="flex gap-2">
          {navItems.slice(3).map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`w-[140px] text-center px-4 py-2 rounded-full transition
                ${
                  location.pathname === item.path
                    ? "bg-white text-black"
                    : "border border-gray-500 hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ✅ Mobil Navbar */}
      <div className="md:hidden px-4 py-3 flex justify-between items-center bg-white text-neutral-800 border-b border-gray-300">
        <a href="/">
          <img src={Logo} alt="Logo" className="h-10" />
        </a>
        <button onClick={() => setIsOpen(!isOpen)} className="z-50">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobil Menü Açılır */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={topBarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 right-0 bg-white text-neutral-800 flex flex-col items-center gap-4 py-6 z-40 border-b border-gray-300"
          >
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg uppercase w-[140px] text-center py-2 rounded-full transition
                  ${
                    location.pathname === item.path
                      ? "bg-black text-white"
                      : "border border-gray-400 hover:bg-gray-100"
                  }
                `}
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

export default NavbarPage;