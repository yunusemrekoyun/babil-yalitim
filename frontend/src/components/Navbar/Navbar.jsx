import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logo.png";

/** ---- Ayarlar ---- */
const LOGO_WIDTH = 200; // px: gerçek logo genişliği
const GAP = 28; // logo ile chipler arası boşluk
const CLOSE_DELAY = 1200; // ms

/** ---- Variants ---- */
const chip = (dir) => ({
  initial: { x: dir === "L" ? 16 : -16, opacity: 0, filter: "blur(3px)" },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: {
    x: dir === "L" ? 16 : -16,
    opacity: 0,
    filter: "blur(3px)",
    transition: { duration: 0.22, ease: "easeIn" },
  },
});

const row = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    transition: { staggerDirection: -1, staggerChildren: 0.05 },
  },
};

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

  /** ---- Mutlak konumlar: logo merkezinden sağ/sola kaydır ---- */
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
            {/* hover kaçmasın diye tampon alan */}
            <span className="absolute inset-[-18px]" />
          </a>

          {/* Sol uçan linkler */}
          <div
            className="absolute pointer-events-none"
            style={leftAnchorStyle}
            onMouseEnter={keepOpen}
            onMouseLeave={delayedClose}
          >
            <AnimatePresence>
              {flyout && (
                <motion.div
                  variants={row}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-row-reverse gap-3"
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
                      {...chip("L")}
                    >
                      {it.label}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sağ uçan linkler */}
          <div
            className="absolute pointer-events-none"
            style={rightAnchorStyle}
            onMouseEnter={keepOpen}
            onMouseLeave={delayedClose}
          >
            <AnimatePresence>
              {flyout && (
                <motion.div
                  variants={row}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-row gap-3"
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
                      {...chip("R")}
                    >
                      {it.label}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* ===== Mobil (değişmedi) ===== */}
      <div className="md:hidden px-4 py-3 flex justify-between items-center bg-black/60 text-white">
        <a href="/">
          <img src={Logo} alt="Logo" className="h-10" />
        </a>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white z-50">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }}
            exit={{ y: "-100%", opacity: 0, transition: { duration: 0.3 } }}
            className="md:hidden absolute top-0 left-0 right-0 bg-black text-white flex flex-col items-center gap-4 py-6 z-40"
          >
            {[...navLeft, ...navRight].map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={() => setIsOpen(false)}
                className={`w-[140px] text-center py-2 text-lg uppercase rounded-full transition ${
                  location.pathname === it.href
                    ? "bg-white text-black"
                    : "border border-white/60 hover:bg-white/10"
                }`}
              >
                {it.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

