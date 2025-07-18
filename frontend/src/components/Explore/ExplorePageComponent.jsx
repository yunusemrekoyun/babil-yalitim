import { useState } from "react";
import Explore from "./Explore";
import ExploreGrid from "./ExploreGrid";

const ExplorePageComponent = () => {
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="w-full">
      {/* Butonlar */}
      <div className="flex justify-center gap-4 mt-6 mb-6">
        <button
          className={`px-4 py-2 rounded-full border border-quaternaryColor transition-all duration-300 ${
            viewMode === "grid"
              ? "bg-blue-100 text-quaternaryColor font-semibold"
              : "bg-white text-black"
          }`}
          onClick={() => setViewMode("grid")}
        >
          Grid Görünüm
        </button>
        <button
          className={`px-4 py-2 rounded-full border border-quaternaryColor transition-all duration-300 ${
            viewMode === "slider"
              ? "bg-blue-100 text-quaternaryColor font-semibold"
              : "bg-white text-black"
          }`}
          onClick={() => setViewMode("slider")}
        >
          Slider Görünüm
        </button>
      </div>

      {/* İçerik */}
      {viewMode === "grid" ? (
        <div className="h-[600px] overflow-y-auto pr-2"> {/* scroll burada */}
          <ExploreGrid />
        </div>
      ) : (
        <div className="min-h-[90vh]">
          <Explore />
        </div>
      )}
    </div>
  );
};

export default ExplorePageComponent;