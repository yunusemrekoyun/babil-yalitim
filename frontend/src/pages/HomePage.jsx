/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
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

const HomePage = () => {
  const vA = useRef(null);
  const vB = useRef(null);
  const stateRef = useRef({
    active: "A", // şu anda görünen video
    fading: false, // çapraz solma devam ediyor mu
    rafId: null,
  });

  useEffect(() => {
    const A = vA.current;
    const B = vB.current;
    if (!A || !B) return;

    const OVERLAP = 1.2; // sn: sondan bu kadar önce fade başlat
    const FADE_MS = OVERLAP * 1000;

    // performans için
    A.preload = "auto";
    B.preload = "auto";
    A.muted = true;
    B.muted = true;
    A.playsInline = true;
    B.playsInline = true;
    A.style.willChange = "opacity";
    B.style.willChange = "opacity";

    const playSafe = (el) => el.play().catch(() => {});

    const startBoth = () => {
      // A görünür, B görünmez başlar
      A.currentTime = 0.01;
      B.currentTime = 0.01;
      A.style.opacity = 1;
      B.style.opacity = 0;
      playSafe(A);
      // B’yi arka planda bufferlasın diye çal-dur yapmaya gerek yok
    };

    const crossFade = (fromEl, toEl) => {
      stateRef.current.fading = true;

      // hedef: toEl’i 0’dan başlatıp OVERLAP süresinde görünür yapmak
      try {
        toEl.currentTime = 0.01;
      } catch {
        console.error("Failed to reset time");
      }
      playSafe(toEl);

      // CSS transition ile pürüzsüz geçiş
      toEl.style.transition = `opacity ${FADE_MS}ms linear`;
      fromEl.style.transition = `opacity ${FADE_MS}ms linear`;
      toEl.style.opacity = 1;
      fromEl.style.opacity = 0;

      // FADE bitince state’i güncelle
      setTimeout(() => {
        // from’u durdur (CPU/GPU tasarruf)
        try {
          fromEl.pause();
        } catch {
          console.error("Failed to pause video");
        }
        stateRef.current.active = stateRef.current.active === "A" ? "B" : "A";
        stateRef.current.fading = false;
      }, FADE_MS + 30);
    };

    const tick = () => {
      const { active, fading } = stateRef.current;
      const cur = active === "A" ? A : B;
      const other = active === "A" ? B : A;

      // metadata yoksa bekle
      if (!cur.duration || isNaN(cur.duration)) {
        stateRef.current.rafId = requestAnimationFrame(tick);
        return;
      }

      // sondan OVERLAP sn önce diğerini başa al ve fade başlat
      if (!fading && cur.currentTime >= Math.max(0, cur.duration - OVERLAP)) {
        crossFade(cur, other);
      }

      stateRef.current.rafId = requestAnimationFrame(tick);
    };

    const onReady = () => {
      startBoth();
      // A görünür şekilde başlasın
      stateRef.current.active = "A";
      stateRef.current.rafId = requestAnimationFrame(tick);
    };

    // bazı tarayıcılarda metadata biri önce gelir
    const readyCheck = () =>
      A.readyState >= 1 && B.readyState >= 1 ? onReady() : null;
    const onMetaA = () => readyCheck();
    const onMetaB = () => readyCheck();

    A.addEventListener("loadedmetadata", onMetaA);
    B.addEventListener("loadedmetadata", onMetaB);

    // eğer zaten hazırsa hemen başlat
    readyCheck();

    // sekme görünürlüğü değişince play/pause yönet
    const onVis = () => {
      const cur = stateRef.current.active === "A" ? A : B;
      if (document.visibilityState === "hidden") {
        try {
          A.pause();
          B.pause();
        } catch {
          console.error("Failed to pause video");
        }
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
      // geçiş stillerini temizle
      A.style.transition = "";
      B.style.transition = "";
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Arka plan video (çift katman) */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        {/* Alt katman (A) */}
        <video
          ref={vA}
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
        {/* Üst katman (B) */}
        <video
          ref={vB}
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          style={{ opacity: 0 }}
        />
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
