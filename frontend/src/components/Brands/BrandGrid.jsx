import BrandItem from "./BrandItem";

const brands = [
  {
    id: 1,
    name: "Koster",
    img: "/src/assets/brand-koster.png",
    link: "https://koster.com",
  },
  {
    id: 2,
    name: "Sika",
    img: "/src/assets/brand-sika.png",
    link: "https://sika.com",
  },
  {
    id: 3,
    name: "ODE",
    img: "/src/assets/brand-ode.png",
    link: "https://ode.com.tr",
  },
  {
    id: 4,
    name: "Geoplas",
    img: "/src/assets/brand-geoplas.png",
    link: "https://geoplas.com",
  },
  {
    id: 5,
    name: "Huntsman",
    img: "/src/assets/brand-huntsman.png",
    link: "https://huntsman.com",
  },
  {
    id: 6,
    name: "Monokim",
    img: "/src/assets/brand-monokim.png",
    link: "https://monokim.com",
  },
];

const BrandGrid = () => {
  // Sonsuz kayma için listeyi 2 defa çoğaltıyoruz
  const fullList = [...brands, ...brands];

  return (
    <div id="brands" className="w-full overflow-hidden relative mt-10">
      <div className="flex animate-marquee whitespace-nowrap">
        {fullList.map((brand, index) => (
          <div key={index} className="mx-8">
            <BrandItem brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;
