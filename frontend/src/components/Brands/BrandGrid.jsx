import brand1 from "../../assets/brand-geoplas.png";
import brand2 from "../../assets/brand-sika.png";
import brand3 from "../../assets/brand-koster.png";
import brand4 from "../../assets/brand-monokim.png";
import brand5 from "../../assets/brand-ode.png";
import brand6 from "../../assets/brand-geoplas.png";
import BrandItem from "./BrandItem";

const brands = [
  { name: "Marka 1", image: brand1 },
  { name: "Marka 2", image: brand2 },
  { name: "Marka 3", image: brand3 },
  { name: "Marka 4", image: brand4 },
  { name: "Marka 5", image: brand5 },
  { name: "Marka 6", image: brand6 },
];

const BrandGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-6 pb-10">
      {brands.map((brand, index) => (
        <BrandItem key={index} brand={brand} />
      ))}
    </div>
  );
};

export default BrandGrid;
