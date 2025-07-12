import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Explore from "./components/Explore/Explore";
import Journal from "./components/Journal/Journal";
import Footer from "./components/Footer/Footer";
import ProjeGrid from "./components/ProjeGrid/projeGrid";
import WhyUs from "./components/WhyUs/WhyUs";
import About from "./components/About/About";
import heroVideo from "./assets/hero.mp4";


const App = () => {
  return (
    <div className="">
      {/* Video arka plan */}
      <video
        src={heroVideo}
        className="fixed top-0 left-0 w-full h-[700px] object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        style={{ objectFit: "cover" }}
        onLoadedMetadata={e => { e.target.playbackRate = 0.5; }}
      />
      {/* Alt siyah overlay veya gradient yok, sadece içerik */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <div className="relative z-10 -mt-16 bg-tertiaryColor rounded-t-3xl shadow-2xl pt-12 pb-2 px-0">
          <ProjeGrid />
          <Explore />
          <Journal />
          <WhyUs />
          <About />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
