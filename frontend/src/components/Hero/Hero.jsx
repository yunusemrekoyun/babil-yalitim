// src/components/Hero/Hero.jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import LinksSection from "../Links/LinksSection";
import BrandsSection from "../Brands/BrandsSection";
import HeroServiceRibbon from "./HeroServiceRibbon.jsx";

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
const easeOutCubic = (value) => 1 - Math.pow(1 - clamp01(value), 3);
const easeInOutCubic = (value) => {
  const t = clamp01(value);
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const Hero = ({ targetId = "after-hero" }) => {
  const linksRef = useRef(null);
  const mobileHeroRef = useRef(null);
  const mobileArrowRef = useRef(null);
  const [mobileRevealProgress, setMobileRevealProgress] = useState(0);
  const [mobileArrowTop, setMobileArrowTop] = useState(null);
  const [mobileArrowDismissed, setMobileArrowDismissed] = useState(false);
  const [mobileArrowVisible, setMobileArrowVisible] = useState(true);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const section = mobileHeroRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScrollable = Math.max(
        section.offsetHeight - window.innerHeight,
        1
      );
      const nextProgress = clamp01(-rect.top / totalScrollable);

      if (nextProgress > 0.018) {
        setMobileArrowDismissed(true);
        setMobileArrowVisible(false);
      }

      setMobileRevealProgress((prev) =>
        Math.abs(prev - nextProgress) < 0.01 ? prev : nextProgress
      );
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    const updateArrowPosition = () => {
      frameId = 0;

      const vv = window.visualViewport;
      const visibleBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
      const heroRect = mobileHeroRef.current?.getBoundingClientRect();
      const buttonHeight = mobileArrowRef.current?.offsetHeight || 44;
      const gap = vv
        ? Math.max(14, Math.min(24, vv.height * 0.018 + 8))
        : 18;
      const nextTop = Math.max(visibleBottom - buttonHeight - gap, 0);
      const nextVisible =
        !mobileArrowDismissed &&
        Boolean(heroRect && heroRect.top < visibleBottom - 24 && heroRect.bottom > 56);

      setMobileArrowTop((prev) =>
        prev !== null && Math.abs(prev - nextTop) < 1 ? prev : nextTop
      );
      setMobileArrowVisible((prev) => (prev === nextVisible ? prev : nextVisible));
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateArrowPosition);
    };

    updateArrowPosition();

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    const vv = window.visualViewport;
    vv?.addEventListener("resize", scheduleUpdate);
    vv?.addEventListener("scroll", scheduleUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      vv?.removeEventListener("resize", scheduleUpdate);
      vv?.removeEventListener("scroll", scheduleUpdate);
    };
  }, [mobileArrowDismissed]);

  const scrollToTarget = () => {
    // Önce dışarıdaki çıpa (tercih edilen)
    const external = document.getElementById(targetId);
    const header = document.getElementById("site-navbar");
    const headerH = header ? header.offsetHeight : 0;

    if (external) {
      const rect = external.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerH - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      return;
    }

    // Fallback: içerideki LinksSection’a (desktop’ta zaten görünür)
    const el = linksRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerH - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  const mobileTitleProgress = easeInOutCubic(mobileRevealProgress / 0.5);
  const mobileDetailsProgress = easeOutCubic(
    (mobileRevealProgress - 0.07) / 0.28
  );
  const mobileTitleScale = 1 - mobileTitleProgress * 0.14;
  const mobileTitleY = -mobileTitleProgress * 18;
  const mobileTitleOpacity = 1 - mobileTitleProgress * 0.1;
  const mobileDetailsMaxHeight = 360 * mobileDetailsProgress;
  const mobileDetailsY = 18 * (1 - mobileDetailsProgress);
  const mobileDetailsScale = 0.985 + mobileDetailsProgress * 0.015;

  return (
    <>
      {/* ======== MOBILE ======== */}
      <section
        ref={mobileHeroRef}
        className="md:hidden relative min-h-[128dvh] overflow-hidden px-3 bg-gradient-to-t from-white/10 to-transparent"
      >
        <div
          className="sticky top-0 flex min-h-[100dvh] flex-col"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
        >
          <div className="w-full px-2 pt-[16vh] z-20">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{
                scale: mobileTitleScale,
                y: mobileTitleY,
                opacity: mobileTitleOpacity,
                transformOrigin: "top center",
              }}
              className="mx-auto max-w-[22rem] text-center will-change-transform"
            >
              <h1 className="text-[42px] xs:text-[48px] font-extrabold text-white drop-shadow-lg leading-[0.95]">
                Yalıtımda Uzman
              </h1>
              <p className="mt-3 text-lg xs:text-xl text-gray-100">
                Babil&#39;e Hoş Geldiniz.
              </p>
            </motion.div>
          </div>

          <div
            className="w-full px-1 z-20"
            style={{ marginTop: "clamp(4.75rem, 18vh, 9rem)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52 }}
              className="relative z-20 w-full max-w-4xl mx-auto"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              aria-hidden={mobileDetailsProgress < 0.05}
              initial={false}
              style={{
                opacity: mobileDetailsProgress,
                y: mobileDetailsY,
                scale: mobileDetailsScale,
                maxHeight: `${mobileDetailsMaxHeight}px`,
                transformOrigin: "top center",
              }}
              className={`relative z-10 mt-5 overflow-hidden ${
                mobileDetailsProgress < 0.08 ? "pointer-events-none" : ""
              }`}
            >
              <div className="w-full relative z-30">
                <HeroServiceRibbon />
              </div>

              <div className="relative z-10 w-full mt-4 px-1">
                <BrandsSection />
              </div>
            </motion.div>
          </div>

          <div
            className={`pointer-events-none fixed inset-x-0 z-[70] flex justify-center md:hidden transition-opacity duration-200 ${
              mobileArrowVisible ? "opacity-100" : "opacity-0"
            }`}
            style={
              mobileArrowTop !== null
                ? { top: `${mobileArrowTop}px` }
                : { bottom: "4.25rem" }
            }
          >
            <motion.button
              ref={mobileArrowRef}
              onClick={scrollToTarget}
              aria-label="Aşağı kaydır"
              className="pointer-events-auto transform-gpu-soft rounded-full border border-white/30 bg-white/15 backdrop-blur-xl
                         shadow-[0_6px_30px_rgba(0,0,0,0.2)] p-2.5 hover:bg-white/25 transition"
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1.6,
                ease: "easeInOut",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/90"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ======== DESKTOP ======== */}
      <section className="hidden md:flex min-h-screen flex-col justify-center items-center bg-gradient-to-t from-white/10 to-transparent px-8 relative">
        <div className="container max-w-[92%] xs:max-w-[85%] sm:max-w-4xl mx-auto relative z-20 flex flex-col items-center text-center gap-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Yalıtımda Uzman
            </h1>
            <p className="mt-2 text-xl text-gray-300">
              Babil&#39;e Hoş Geldiniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-30 w-full"
          >
            <HeroServiceRibbon />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.58 }}
            className="w-16 h-1 bg-quaternaryColor rounded-full"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.72 }}
            className="relative z-20 w-full"
          >
            <SearchBar />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative z-10 w-full mt-8 px-6"
        >
          <BrandsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="w-full flex justify-center mt-4 z-20"
        >
          <motion.button
            onClick={scrollToTarget}
            aria-label="Aşağı kaydır"
            className="transform-gpu-soft rounded-full border border-white/30 bg-white/15 backdrop-blur-xl shadow-[0_6px_30px_rgba(0,0,0,0.2)] p-3.5 hover:bg-white/25 transition"
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.6,
              ease: "easeInOut",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-white/90"
            >
              <path
                d="M6 9l6 6 6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>

        <div
          ref={linksRef}
          className="w-full flex justify-center mt-16 px-4 z-10"
        >
          <LinksSection />
        </div>
      </section>
    </>
  );
};

Hero.propTypes = {
  /** Ok tıklandığında kaydırılacak dış anchor’ın id’si */
  targetId: PropTypes.string,
};

export default Hero;
