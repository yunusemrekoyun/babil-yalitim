import BrandGrid from "./BrandGrid";

const BrandsSection = () => {
  return (
    <div className="w-full py-10 bg-white/10 backdrop-blur-sm">
      <h3 className="text-center text-xl font-semibold text-white mb-4 underline">
        İş Birliği Yaptığımız Markalar
      </h3>
      <BrandGrid />
    </div>
  );
};

export default BrandsSection;