import React from "react";

const BrandItem = ({ brand }) => {
  return (
    <div className="w-32 h-20 flex items-center justify-center bg-white/60 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
      <img src={brand.img} alt={brand.name} className="h-12 object-contain" />
    </div>
  );
};

export default BrandItem;