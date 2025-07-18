// components/Explore/ExplorePageComponent.jsx

import { useState } from "react";
import ExploreP from "./ExploreSlider";
import ExploreGrid from "./ExploreGrid";

const ExplorePageComponent = () => {
  const [viewMode, setViewMode] = useState("slider");

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-12 bg-gradient-to-br from-orange-500 via-gray-100 to-orange-300">
      <div className="max-w-6xl mx-auto text-center mb-1">
      

        {/* Geçiş Butonu */}
        <button
          onClick={() => setViewMode(viewMode === "slider" ? "grid" : "slider")}
          className="px-6 py-2 bg-quaternaryColor text-white rounded-full shadow hover:bg-white hover:text-quaternaryColor border border-quaternaryColor transition-all duration-300"
        >
          {viewMode === "slider"
            ? "Tüm Hizmetleri Gör"
            : "Slider Görünümüne Dön"}
        </button>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto">
        {viewMode === "slider" ? <ExploreP /> : <ExploreGrid />}
      </div>
    </div>
  );
};

export default ExplorePageComponent;