// src/pages/HomePage.jsx
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Journal from "../components/Journal/JournalGrid";
import Footer from "../components/Footer/Footer";
import ProjectsSection from "../components/ProjeGrid/ProjectsSection";
import WhyUs from "../components/WhyUs/WhyUs";
import ServiceSection from "../components/Service/ServiceSection";
import AboutSection from "../components/About/AboutSection";
import GlassSection from "../components/Layout/GlassSection";
import BlogGrid from "../components/Blog/BlogGrid";
import BackgroundVideo from "../components/Background/BackgroundVideo";

const HERO_DESKTOP = import.meta.env.VITE_HERO_PUBLIC_ID;
const HERO_MOBILE = import.meta.env.VITE_HERO_MOBILE_PUBLIC_ID;
const HERO_POSTER = import.meta.env.VITE_HERO_POSTER_PUBLIC_ID;

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundVideo
        desktopPublicId={HERO_DESKTOP}
        mobilePublicId={HERO_MOBILE}
        posterPublicId={HERO_POSTER}
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
}
