import BrandGrid from "./BrandGrid";

const BrandsSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 pt-6 pb-14" id="brands">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">
            İş Birliği Yaptığımız Markalar
          </h3>
          <div className="h-1 w-20 bg-quaternaryColor/90 mx-auto mt-4 rounded-full" />
        </div> */}
        <div className="glass-shell-strong pt-2 pb-4 px-4 sm:px-6">
          <BrandGrid />
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
