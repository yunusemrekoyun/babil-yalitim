// LinksSection.jsx
import { useState } from "react";
import img1 from "../../assets/services.jpg";
import img2 from "../../assets/projects.jpg";
import img3 from "../../assets/brands.jpg";
import LinkItem from "./LinkItem";

const links = [
  {
    label: "Hizmetler",
    img: img1,
    color: "text-secondaryColor",
    desc: "Hizmetlerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.",
    href: "/services",
  },
  {
    label: "Projeler",
    img: img2,
    color: "text-quaternaryColor",
    desc: "Projelerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.",
    href: "/projects",
  },
  {
    label: "Bloglar",
    img: img3,
    color: "text-brandBlue",
    desc: "Sizler için yayınladığımız içerikleri görmek için tıklayın.",
    href: "/blog",
  },
];

const LinksSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-full flex justify-center mt-6 px-4">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 items-end max-w-screen-xl">
        {links.map((link, idx) => (
          <LinkItem
            key={link.label}
            label={link.label}
            img={link.img}
            color={link.color}
            desc={link.desc}
            href={link.href}
            isHovered={hoveredIndex === idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            
          />
        ))}
      </div>
    </div>
  );
};

export default LinksSection;
