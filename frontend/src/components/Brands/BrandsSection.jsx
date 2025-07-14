import BrandGrid from "./BrandGrid";

const BrandsSection = () => {
  return (
    <section className="w-full px-4 py-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-6">
        Markalarımız
      </h2>
      <div className="h-1 w-20 bg-quaternaryColor mx-auto mb-10 rounded"></div>

      <BrandGrid />
    </section>
  );
};

export default BrandsSection;
