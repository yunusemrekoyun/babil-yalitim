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
import { usePerformanceProfile } from "../performance/PerformanceProvider";
import api from "../api";
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
} from "../utils/siteSettings";
import { fetchServicesCached } from "../utils/servicesCache";

export default function HomePage() {
  const { isMobile, sectionRootMargin } = usePerformanceProfile();
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

  useEffect(() => {
    let cancelled = false;
    let timerId = 0;

    const preload = () => {
      fetchServicesCached().catch((error) => {
        if (!cancelled) {
          console.error("[HomePage] preload /services error:", error);
        }
      });

      import("./ServicePage.jsx").catch(() => {});
      import("./ServiceDetailsPage.jsx").catch(() => {});
      import("./SubServiceDetailsPage.jsx").catch(() => {});
    };

    if (!isMobile) {
      preload();
      return () => {
        cancelled = true;
      };
    }

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(idleId);
      };
    }

    timerId = window.setTimeout(preload, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [isMobile]);

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
        eager: !isMobile,
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
    [isMobile, siteSettings.homeProjectsVisible]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
