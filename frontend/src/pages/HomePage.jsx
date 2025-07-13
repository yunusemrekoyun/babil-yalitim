import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Journal from "../components/Journal/Journal";
import Footer from "../components/Footer/Footer";
import ProjectsSection from "../components/ProjeGrid/ProjectsSection";
import WhyUs from "../components/WhyUs/WhyUs";
import heroVideo from "../assets/hero.mp4";
import PropTypes from "prop-types";
import ExploreSection from "../components/Explore/ExploreSection";
import AboutSection from "../components/About/AboutSection";

const HomePage = () => {
  const navigate = useNavigate();
  const Wrapper = ({ children, to }) => (
    <div className="relative group border-4 border-transparent transition-all duration-300">
      <div
        onClick={() => navigate(to)}
        className="absolute inset-0 z-10 cursor-pointer"
      />
      {children}
    </div>
  );

  Wrapper.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string.isRequired,
  };

  return (
    <div className="">
      {/* Arka plan video */}
      <video
        src={heroVideo}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        style={{ objectFit: "cover" }}
        onLoadedMetadata={(e) => {
          e.target.playbackRate = 0.5;
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <Hero />

        <div className="bg-buzbeyazseffaf space-y-6">
          <Wrapper to="/projects">
            <ProjectsSection />
          </Wrapper>
          <Wrapper to="/explore">
            <ExploreSection />
          </Wrapper>
          <Wrapper to="/journal">
            <Journal />
          </Wrapper>
          <Wrapper to="/whyus">
            <WhyUs />
          </Wrapper>
          <Wrapper to="/about">
            <AboutSection />
          </Wrapper>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
