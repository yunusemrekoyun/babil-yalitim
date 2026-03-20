// src/components/Navbar/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logo.png";

/** ---- Ayarlar ---- */
const LOGO_WIDTH = 200; // px: desktop merkez hesapları için
const GAP = 28;
const CLOSE_DELAY = 1200;

/** ---- Variants ---- */
const listVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.25, 0.8, 0.4, 1],
      when: "beforeChildren",
      delayChildren: 0.05,
      staggerChildren: 0.035,
    },
  },
};

const chip = (dir) => ({
  hidden: { x: dir === "L" ? 10 : -10, opacity: 0, scale: 0.96 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.18, ease: [0.22, 0.68, 0.4, 0.92] },
  },
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobil
  const [flyout, setFlyout] = useState(false); // desktop hover
  const hideTimer = useRef(null);
  const location = useLocation();

  const navLeft = [
    { label: "Hakkımızda", href: "/about" },
    { label: "Projeler", href: "/projects" },
    { label: "Hizmetler", href: "/services" },
  ];
  const navRight = [
    { label: "Blog", href: "/blog" },
    { label: "Haberler", href: "/journal" },
    { label: "İletişim", href: "/iletisim" },
  ];

  const keepOpen = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setFlyout(true);
  };
  const delayedClose = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setFlyout(false), CLOSE_DELAY);
  };

  /** body scroll kilidi (mobil menü açıkken) */
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /** ---- Desktop için mutlak konumlar ---- */
  const half = LOGO_WIDTH / 2;
  const leftAnchorStyle = {
    left: `calc(50% - ${half + GAP}px)`,
    transform: "translateX(-100%) translateY(-50%)",
    top: "50%",
  };
  const rightAnchorStyle = {
    left: `calc(50% + ${half + GAP}px)`,
    transform: "translateX(0) translateY(-50%)",
    top: "50%",
  };

  return (
    <header className="w-full z-30 relative">
      {/* ===== Masaüstü ===== */}
      <nav className="hidden md:flex relative container mx-auto items-center justify-center py-5 text-white uppercase font-semibold text-sm lg:text-base select-none">
        {/* Logo + görünmez hover alanı */}
        <div
          className="relative"
          onMouseEnter={keepOpen}
          onMouseLeave={delayedClose}
          style={{ width: LOGO_WIDTH }}
        >
          <a href="/" className="block relative">
            <img src={Logo} alt="Logo" className="w-full pointer-events-none" />
            <span className="absolute inset-[-18px]" />
          </a>

          {/* Sol uçan linkler */}
          <div
            className="absolute"
            style={leftAnchorStyle}
            onMouseEnter={keepOpen}
            onMouseLeave={delayedClose}
          >
            <motion.div
              initial="hidden"
              animate={flyout ? "visible" : "hidden"}
              variants={listVariants}
              style={{ pointerEvents: flyout ? "auto" : "none" }}
              className="flex flex-row-reverse gap-3 will-change-transform"
            >
              {navLeft.map((it) => (
                <motion.a
                  key={it.href}
                  href={it.href}
                  className={`pointer-events-auto whitespace-nowrap rounded-full border border-white/80 px-4 py-2 text-center transition ${
                    location.pathname === it.href
                      ? "bg-white text-black"
                      : "hover:bg-white/10"
                  }`}
                  variants={chip("L")}
                  initial="hidden"
                  animate="visible"
                  style={{ willChange: "transform, opacity" }}
                >
                  {it.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Sağ uçan linkler */}
          <div
            className="absolute"
            style={rightAnchorStyle}
            onMouseEnter={keepOpen}
            onMouseLeave={delayedClose}
          >
            <motion.div
              initial="hidden"
              animate={flyout ? "visible" : "hidden"}
              variants={listVariants}
              style={{ pointerEvents: flyout ? "auto" : "none" }}
              className="flex flex-row gap-3 will-change-transform"
            >
              {navRight.map((it) => (
                <motion.a
                  key={it.href}
                  href={it.href}
                  className={`pointer-events-auto whitespace-nowrap rounded-full border border-white/80 px-4 py-2 text-center transition ${
                    location.pathname === it.href
                      ? "bg-white text-black"
                      : "hover:bg-white/10"
                  }`}
                  variants={chip("R")}
                  initial="hidden"
                  animate="visible"
                  style={{ willChange: "transform, opacity" }}
                >
                  {it.label}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ===== Mobil (light/glass tasarım) ===== */}
      <div className="md:hidden sticky top-0 z-40 px-4 py-3 text-white">
        {/* bar'ı şeffaf tut, okunabilirlik için çok hafif cam efekti ve çizgi */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border-b border-white/20 pointer-events-none" />
        <div className="relative flex min-h-[3rem] items-center justify-center">
          <a href="/" className="relative z-10 shrink-0">
            {/* logo daha büyük */}
            <img src={Logo} alt="Logo" className="h-14 w-auto" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-0 z-10 grid size-10 place-items-center rounded-md text-white active:scale-95"
            aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{
              y: "-100%",
              opacity: 0,
              transition: { duration: 0.28, ease: "easeIn" },
            }}
            className="md:hidden fixed inset-0 z-40"
          >
            {/* aydınlık, siyahsız menü yüzeyi */}
            <div className="absolute inset-0 bg-white/85 backdrop-blur-md" />
            <div className="relative h-full w-full flex flex-col items-center gap-4 pt-[calc(env(safe-area-inset-top,0)+88px)] pb-[calc(env(safe-area-inset-bottom,0)+24px)]">
              {[...navLeft, ...navRight].map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-[78%] max-w-xs text-center py-3 text-lg uppercase rounded-full transition ${
                    location.pathname === it.href
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {it.label}
                </a>
              ))}
            </div>

            {/* kapatma butonu (üst sağ) – kontrastlı */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Kapat"
              className="absolute top-[calc(env(safe-area-inset-top,0)+12px)] right-4 text-gray-900/80 hover:text-gray-900 active:scale-95"
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
