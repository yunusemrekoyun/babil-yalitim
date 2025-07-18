import React from "react";
import BrandItem from "./BrandItem";

const brands = [
  { id: 1, name: "Marka 1", img: "../src/assets/brand-koster.png" },
  { id: 2, name: "Marka 2", img: "../src/assets/brand-sika.png" },
  { id: 3, name: "Marka 3", img: "../src/assets/brand-ode.png" },
  { id: 4, name: "Marka 4", img: "../src/assets/brand-geoplas.png" },
  { id: 5, name: "Marka 5", img: "../src/assets/brand-huntsman.png" },
  { id: 6, name: "Marka 6", img: "../src/assets/brand-monokim.png" },
];

const BrandGrid = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-12 animate-scroll-x whitespace-nowrap">
        {brands.concat(brands).map((brand, index) => (
          <div key={index} className="inline-block">
            <BrandItem brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;