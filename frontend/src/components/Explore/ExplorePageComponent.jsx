// src/components/Explore/ExplorePageComponent.jsx

import ExploreGrid from "./ExploreGrid";

const ExplorePageComponent = () => {
  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-4xl font-bold text-secondaryColor mb-2">
          Hizmetlerimiz
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-md">
          Babil Yalıtım olarak sunduğumuz profesyonel hizmetleri aşağıdan
          inceleyebilirsiniz.
        </p>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded mt-4"></div>
      </div>
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <ExploreGrid />
      </div>
    </section>
  );
};

export default ExplorePageComponent;
