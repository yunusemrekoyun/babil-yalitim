import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Journal from "../components/Journal/Journal";
import Footer from "../components/Footer/Footer";
import ProjectsSection from "../components/ProjeGrid/ProjectsSection";
import WhyUs from "../components/WhyUs/WhyUs";
import heroVideo from "../assets/hero.mp4";
import ExploreSection from "../components/Explore/ExploreSection";
import AboutSection from "../components/About/AboutSection";
import GlassSection from "../components/Layout/GlassSection";
import BrandsSection from "../components/Brands/BrandsSection";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Arka plan video */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        <video
          src={heroVideo}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={(e) => {
            e.target.playbackRate = 0.5;
          }}
        />
      </div>

      {/* İçerik */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <BrandsSection />

        <div className="bg-transparanColor space-y-12 w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex flex-col items-center justify-center">
          <GlassSection>
            <ProjectsSection />
          </GlassSection>
          <GlassSection>
            <ExploreSection />
          </GlassSection>
          <GlassSection>
            <Journal />
          </GlassSection>
          <GlassSection>
            <WhyUs />
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