// frontend/src/components/Brands/BrandGrid.jsx
import BrandItem from "./BrandItem";
import useViewportActivation from "../../hooks/useViewportActivation";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

import brandKoster from "../../assets/brand-koster.png";
import brandSika from "../../assets/brand-sika.png";
import brandOde from "../../assets/brand-ode.png";
import brandGeoplas from "../../assets/brand-geoplas.png";
import brandHuntsman from "../../assets/brand-huntsman.png";
import brandMonokim from "../../assets/brand-monokim.png";

const brands = [
  { id: 1, name: "Koster", img: brandKoster, link: "https://www.kostermarket.com/" },
  { id: 2, name: "Sika", img: brandSika, link: "https://tur.sika.com/" },
  { id: 3, name: "ODE", img: brandOde, link: "https://ode.com.tr" },
  { id: 4, name: "Geoplas", img: brandGeoplas, link: "https://www.geoplas.com.tr/en" },
  { id: 5, name: "Huntsman", img: brandHuntsman, link: "https://huntsman.com" },
  { id: 6, name: "Monokim", img: brandMonokim, link: "https://monokim.com" },
];

const BrandGrid = () => {
  const [ref, inView] = useViewportActivation({
    once: false,
    rootMargin: "120px 0px",
  });
  const { allowMarquee } = usePerformanceProfile();
  const fullList = [...brands, ...brands, ...brands];

  return (
    <div ref={ref} id="brands" className="relative mt-5 w-full overflow-hidden">
      <div
        className={`flex whitespace-nowrap animate-brand-marquee ${
          allowMarquee && inView ? "" : "motion-paused"
        }`}
      >
        {fullList.map((brand, index) => (
          <div key={`${brand.id}-${index}`} className="mx-4 sm:mx-8">
            <BrandItem brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;
