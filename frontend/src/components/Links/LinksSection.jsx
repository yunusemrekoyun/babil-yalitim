import { useState } from 'react';
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.jpg';

const links = [
  { label: "Hizmetler", img: img1, color: "text-secondaryColor", desc: "Hizmetlerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.", href: "#hizmetler" },
  { label: "Projeler", img: img2, color: "text-quaternaryColor", desc: "Projelerimiz hakkında detaylı bilgiye ulaşmak için tıklayın.", href: "#projeler" },
  { label: "Markalar", img: img3, color: "text-brandBlue", desc: "Çalıştığımız markaları görmek için tıklayın.", href: "#markalar" },
];

const LinksSection = () => {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="flex flex-row w-full max-w-4xl gap-8 items-end justify-center">
        {links.map((link, idx) => (
          <div
            key={link.label}
            className={`bg-white rounded-2xl border-4 border-white shadow-lg flex flex-col items-center transition-all duration-300 ease-in-out cursor-pointer relative
              ${hovered === idx ? 'z-20 scale-110 shadow-2xl p-6 w-72 -mb-8' : 'z-0 scale-100 p-4 w-60'}
            `}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{ minHeight: hovered === idx ? 320 : 220 }}
          >
            <img
              src={link.img}
              alt={link.label}
              className={`object-cover rounded-xl mb-2 transition-all duration-300 shadow-lg
                ${hovered === idx ? 'w-32 h-32 -mt-12' : 'w-full h-32 mt-0'}
              `}
            />
            <span className={`font-bold ${hovered === idx ? 'text-xl mb-2 mt-2' : 'text-lg mt-2'} ${link.color}`}>{link.label}</span>
            <div
              className={`transition-all duration-300 text-gray-500 text-center text-sm mb-4 overflow-hidden
                ${hovered === idx ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0 m-0'}
              `}
            >
              {link.desc}
            </div>
            <a
              href={link.href}
              className={`transition-all duration-300 bg-quaternaryColor text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-secondaryColor
                ${hovered === idx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
              `}
            >
              Detay
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksSection;  