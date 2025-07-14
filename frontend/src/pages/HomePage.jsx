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
// Tekil section sarmalayıcı

const HomePage = () => {
  return (
    <div>
      {/* Arka plan video */}
      <video
        src={heroVideo}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.target.playbackRate = 0.5;
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <Hero />

        <div className="bg-transparanColor space-y-12 relative w-full px-4 py-16 flex flex-col items-center justify-center">
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
           <GlassSection>
            <BrandsSection />
          </GlassSection>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
