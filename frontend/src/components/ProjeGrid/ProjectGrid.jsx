// src/components/ProjectGrid/ProjectGrid.jsx
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";
import img4 from "../../assets/4.jpg";
import img5 from "../../assets/5.jpg";
import img6 from "../../assets/6.jpg";
import ProjectGridItem from "./ProjectGridItem";

const projectData = [
  {
    title: "Çatı Yalıtımı",
    image: img1,
    description: "Yüksek dayanımlı çatı yalıtım malzemeleri ile uygulandı.",
    size: "large",
  },
  {
    title: "Zemin Kaplama",
    image: img2,
    description: "Kaymaz ve hijyenik epoksi kaplama sistemi kullanıldı.",
    size: "small",
  },
  {
    title: "Temel İzolasyon",
    image: img3,
    description: "Yeraltı su sızıntısına karşı yüksek izolasyon sağlandı.",
    size: "small",
  },
  {
    title: "Cephe Kaplama",
    image: img4,
    description: "Modern cephe panelleriyle dış görünüm yenilendi.",
    size: "small",
  },
  {
    title: "Endüstriyel Alan",
    image: img5,
    description: "Fabrika çatısı komple yalıtım altına alındı.",
    size: "small",
  },
  {
    title: "Saha Yalıtımı",
    image: img6,
    description: "Açık saha zemini sıvı geçirimsiz malzeme ile kaplandı.",
    size: "small",
  },
];

const ProjectGrid = () => {
  return (
    <section className="w-full px-4 py-16 ">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Projeler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded"></div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {projectData.map((project, index) => (
          <ProjectGridItem key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
