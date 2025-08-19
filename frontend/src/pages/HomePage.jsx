/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Journal from "../components/Journal/JournalGrid";
import Footer from "../components/Footer/Footer";
import ProjectsSection from "../components/ProjeGrid/ProjectsSection";
import WhyUs from "../components/WhyUs/WhyUs";
import heroVideo from "../assets/heroo.mp4";
import ServiceSection from "../components/Service/ServiceSection";
import AboutSection from "../components/About/AboutSection";
import GlassSection from "../components/Layout/GlassSection";
import BlogGrid from "../components/Blog/BlogGrid";
import heroPoster from "../assets/hero.png"; // poster/fallback görseli

const HomePage = () => {
  const vA = useRef(null);
  const vB = useRef(null);

  // ► Ortam sinyalleri
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const conn =
    navigator.connection ||
    navigator.webkitConnection ||
    navigator.mozConnection;
  const saveData = !!conn?.saveData;
  const slowNet = ["slow-2g", "2g"].includes(conn?.effectiveType || "");

  // ► Mobilde ya da düşük ağda videoyu hafiflet / kapat
  const disableBgVideo = prefersReduced || saveData || slowNet;
  const useLightMode = isMobile || disableBgVideo; // mobilde crossfade yok

  // resize dinle
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ► Masaüstünde çift video crossfade (mevcut mantık)
  const stateRef = useRef({ active: "A", fading: false, rafId: null });
  useEffect(() => {
    if (useLightMode) return; // mobil/low‑power’da çalıştırma

    const A = vA.current;
    const B = vB.current;
    if (!A || !B) return;

    const OVERLAP = 1.2; // s
    const FADE_MS = OVERLAP * 1000;

    A.preload = "metadata";
    B.preload = "metadata";
    A.muted = B.muted = true;
    A.playsInline = B.playsInline = true;
    A.style.willChange = "opacity";
    B.style.willChange = "opacity";

    const playSafe = (el) => el.play().catch(() => {});
    const startBoth = () => {
      A.currentTime = 0.01;
      B.currentTime = 0.01;
      A.style.opacity = 1;
      B.style.opacity = 0;
      playSafe(A);
    };

    const crossFade = (fromEl, toEl) => {
      stateRef.current.fading = true;
      try {
        toEl.currentTime = 0.01;
      } catch {}
      playSafe(toEl);
      toEl.style.transition = `opacity ${FADE_MS}ms linear`;
      fromEl.style.transition = `opacity ${FADE_MS}ms linear`;
      toEl.style.opacity = 1;
      fromEl.style.opacity = 0;
      setTimeout(() => {
        try {
          fromEl.pause();
        } catch {}
        stateRef.current.active = stateRef.current.active === "A" ? "B" : "A";
        stateRef.current.fading = false;
      }, FADE_MS + 30);
    };

    const tick = () => {
      const { active, fading } = stateRef.current;
      const cur = active === "A" ? A : B;
      const other = active === "A" ? B : A;
      if (!cur.duration || isNaN(cur.duration)) {
        stateRef.current.rafId = requestAnimationFrame(tick);
        return;
      }
      if (!fading && cur.currentTime >= Math.max(0, cur.duration - OVERLAP)) {
        crossFade(cur, other);
      }
      stateRef.current.rafId = requestAnimationFrame(tick);
    };

    const onReady = () => {
      startBoth();
      stateRef.current.active = "A";
      stateRef.current.rafId = requestAnimationFrame(tick);
    };

    const readyCheck = () =>
      A.readyState >= 1 && B.readyState >= 1 ? onReady() : null;
    const onMetaA = () => readyCheck();
    const onMetaB = () => readyCheck();
    A.addEventListener("loadedmetadata", onMetaA);
    B.addEventListener("loadedmetadata", onMetaB);
    readyCheck();

    const onVis = () => {
      const cur = stateRef.current.active === "A" ? A : B;
      if (document.visibilityState === "hidden") {
        try {
          A.pause();
          B.pause();
        } catch {}
      } else {
        playSafe(cur);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      A.removeEventListener("loadedmetadata", onMetaA);
      B.removeEventListener("loadedmetadata", onMetaB);
      document.removeEventListener("visibilitychange", onVis);
      if (stateRef.current.rafId) cancelAnimationFrame(stateRef.current.rafId);
      A.style.transition = "";
      B.style.transition = "";
    };
  }, [useLightMode]);

  // ► Light mode: IntersectionObserver ile görünene kadar oynatma
  const lightVideoRef = useRef(null);
  useEffect(() => {
    if (!useLightMode || !lightVideoRef.current) return;

    const v = lightVideoRef.current;
    // mobilde CPU’yu koru
    v.preload = disableBgVideo ? "none" : "metadata";
    v.muted = true;
    v.playsInline = true;

    let played = false;
    const tryPlay = () => {
      if (!played) v.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !disableBgVideo) {
            tryPlay();
          } else {
            // görünmüyorsa/düşük ağda → dur
            try {
              v.pause();
            } catch {}
          }
        });
      },
      { root: null, threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [useLightMode, disableBgVideo]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Arka plan */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        {useLightMode ? (
          // ► Mobil/low‑power: tek video veya sadece poster
          disableBgVideo ? (
            <img
              src={heroPoster}
              alt="hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <video
              ref={lightVideoRef}
              src={heroVideo}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroPoster}
            />
          )
        ) : (
          // ► Masaüstü: çift katman cross‑fade
          <>
            <video
              ref={vA}
              src={heroVideo}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={heroPoster}
            />
            <video
              ref={vB}
              src={heroVideo}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              preload="metadata"
              style={{ opacity: 0 }}
              poster={heroPoster}
            />
          </>
        )}
      </div>

      {/* İçerik */}
      <div className="relative z-10">
        <Navbar />
        <Hero />

        <div className="bg-transparanColor space-y-12 w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex flex-col items-center justify-center">
          <GlassSection>
            <ProjectsSection />
          </GlassSection>
          <GlassSection>
            <ServiceSection />
          </GlassSection>
          <GlassSection>
            <Journal />
          </GlassSection>
          <GlassSection>
            <WhyUs />
          </GlassSection>
          <GlassSection>
            <BlogGrid />
          </GlassSection>
          <GlassSection>
            <AboutSection />
          </GlassSection>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
