// LinksSection.jsx
import { useState } from "react";
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";
import LinkItem from "./LinkItem";

const links = [
  {
    label: "Hizmetler",
    img: img1,
    color: "text-secondaryColor",
    desc: "Hizmetlerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.",
    href: "#hizmetler",
  },
  {
    label: "Projeler",
    img: img2,
    color: "text-quaternaryColor",
    desc: "Projelerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.",
    href: "#projeler",
  },
  {
    label: "Markalar",
    img: img3,
    color: "text-brandBlue",
    desc: "Çalıştığımız markaları görmek için tıklayın.",
    href: "#markalar",
  },
];

const LinksSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="flex gap-8 items-end h-[320px]">
        {" "}
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
