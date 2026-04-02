// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Journal from "../components/Journal/JournalGrid";
import Footer from "../components/Footer/Footer";
import ProjectsSection from "../components/ProjeGrid/ProjectsSection";
import WhyUs from "../components/WhyUs/WhyUs";
import ServiceSection from "../components/Service/ServiceSection";
import AboutSection from "../components/About/AboutSection";
import GlassSection from "../components/Layout/GlassSection";
import DeferredSection from "../components/Layout/DeferredSection";
import BlogGrid from "../components/Blog/BlogGrid";
import BackgroundVideo from "../components/Background/BackgroundVideo";
import { usePerformanceProfile } from "../performance/PerformanceProvider";
import api from "../api";
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
} from "../utils/siteSettings";

const HERO_DESKTOP = import.meta.env.VITE_HERO_DESKTOP_VIDEO_URL;
const HERO_MOBILE = import.meta.env.VITE_HERO_MOBILE_IMAGE_URL;
const HERO_MOBILE_VIDEO = import.meta.env.VITE_HERO_MOBILE_VIDEO_URL;
const HERO_POSTER = import.meta.env.VITE_HERO_POSTER_URL;

export default function HomePage() {
  const { sectionRootMargin } = usePerformanceProfile();
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let active = true;

    api
      .get("/site-settings")
      .then(({ data }) => {
        if (!active) return;
        setSiteSettings(normalizeSiteSettings(data));
      })
      .catch((error) => {
        console.error("[HomePage] GET /site-settings error:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(
    () => [
      ...(siteSettings.homeProjectsVisible
        ? [
            {
              id: "projects",
              minHeight: 760,
              eager: true,
              content: <ProjectsSection />,
            },
          ]
        : []),
      {
        id: "services",
        minHeight: 860,
        content: <ServiceSection />,
      },
      {
        id: "journal",
        minHeight: 720,
        content: <Journal />,
      },
      {
        id: "why-us",
        minHeight: 700,
        content: <WhyUs />,
      },
      {
        id: "blog",
        minHeight: 720,
        content: <BlogGrid />,
      },
      {
        id: "about",
        minHeight: 640,
        content: <AboutSection />,
      },
    ],
    [siteSettings.homeProjectsVisible]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundVideo
        desktopVideoUrl={HERO_DESKTOP}
        mobileImageUrl={HERO_MOBILE}
        mobileVideoUrl={HERO_MOBILE_VIDEO}
        posterUrl={HERO_POSTER}
      />

      <div className="relative z-10">
        {/* Navbar’a bir id verelim ki yüksekliğini hesaplayabilelim (opsiyonel) */}
        <div id="site-navbar">
          <Navbar />
        </div>

        {/* ↓↓↓ Hero’ya tıklanınca kaydıracağımız hedefin id’si */}
        <Hero targetId="after-hero" />

        {/* Hedef çıpa: sayfanın “devamı” buradan başlıyor */}
        <div id="after-hero" />

        <div className="bg-transparanColor space-y-12 w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex flex-col items-center justify-center">
          {sections.map((section) => (
            <DeferredSection
              key={section.id}
              id={section.id}
              eager={section.eager}
              minHeight={section.minHeight}
              rootMargin={sectionRootMargin}
              className="w-full max-w-6xl"
            >
              <GlassSection>{section.content}</GlassSection>
            </DeferredSection>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
