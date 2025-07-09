import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import HeroImg from "./assets/hero.png";
import Explore from "./components/Explore/Explore";
import Journal from "./components/Journal/Journal";
import Footer from "./components/Footer/Footer";
import ProjeGrid from "./components/ProjeGrid/projeGrid";
import WhyUs from "./components/WhyUs/WhyUs";
import About from "./components/About/About";

const bgImage = {
  backgroundImage: `url(${HeroImg})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "bottom",
  backgroundSize: "cover",
  position: "relative",
};
const App = () => {
  return (
    <div className="overflow-x-hidden bg-brandDark text-white">
      <div style={bgImage}>
        <Navbar />
        <Hero />
      </div>
      Yaptıklarımız
      <ProjeGrid />
      Markalar
      <Explore />
      Haberler
      <Journal />
      Neden Biz
      <WhyUs />
      Hakkımızda
      <About />
      <Footer />
    </div>
  );
};

export default App;
