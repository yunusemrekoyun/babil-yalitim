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
  const fullList = [...brands, ...brands, ...brands]; // 3 tekrar

  return (
    <div className="w-full overflow-hidden relative">
      <div className="marquee-track">
        {fullList.map((brand, index) => (
          <BrandItem key={index} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;