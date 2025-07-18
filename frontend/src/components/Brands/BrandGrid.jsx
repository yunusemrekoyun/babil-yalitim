import React from "react";
import BrandItem from "./BrandItem";

const brands = [
  { id: 1, name: "Marka 1", img: "/logos/logo1.png" },
  { id: 2, name: "Marka 2", img: "/logos/logo2.png" },
  { id: 3, name: "Marka 3", img: "/logos/logo3.png" },
  { id: 4, name: "Marka 4", img: "/logos/logo4.png" },
  { id: 5, name: "Marka 5", img: "/logos/logo5.png" },
  { id: 6, name: "Marka 6", img: "/logos/logo6.png" },
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