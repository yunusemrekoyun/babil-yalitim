// frontend/src/components/Brands/BrandGrid.jsx
import BrandItem from "./BrandItem";

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
  const fullList = [...brands, ...brands];
  return (
    <div id="brands" className="w-full overflow-hidden relative mt-5">
      <div className="flex whitespace-nowrap animate-[marquee_12s_linear_infinite] sm:animate-[marquee_20s_linear_infinite]">
        {fullList.map((brand, index) => (
          <div key={index} className="mx-4 sm:mx-8">
            <BrandItem brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;
