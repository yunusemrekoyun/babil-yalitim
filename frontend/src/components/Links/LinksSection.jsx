// src/components/Links/LinksSection.jsx
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
    <div className="w-full flex justify-center mt-6 px-0 sm:px-4 relative">
      <div
        className="
          w-full max-w-screen-xl
          flex flex-wrap justify-center items-end
          gap-5 sm:gap-8 md:gap-10
          px-0
        "
      >
        {links.map((link, idx) => (
          <div key={link.label}>
            <LinkItem
              label={link.label}
              img={link.img}
              color={link.color}
              desc={link.desc}
              href={link.href}
              isHovered={hoveredIndex === idx}
              forceExpanded={false}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksSection;
