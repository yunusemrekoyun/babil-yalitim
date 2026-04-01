import BrandGrid from "./BrandGrid";

const BrandsSection = () => {
  return (
    <section
      className="w-full px-2 pt-3 pb-4 sm:px-6 sm:pt-6 sm:pb-14 md:px-8"
      id="brands"
    >
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">
            İş Birliği Yaptığımız Markalar
          </h3>
          <div className="h-1 w-20 bg-quaternaryColor/90 mx-auto mt-4 rounded-full" />
        </div> */}
        <div className="glass-shell-strong px-3 pt-2 pb-3 sm:px-6 sm:pb-4">
          <BrandGrid />
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
