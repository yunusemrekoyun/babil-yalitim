import PropTypes from "prop-types";

const LinkItem = ({
  label,
  img,
  color,
  desc,
  href,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className={`bg-buzbeyazseffaf rounded-2xl shadow-lg flex flex-col items-center transition-all duration-300 ease-in-out cursor-pointer relative
      w-full sm:w-60
      ${isHovered ? "z-20 p-6" : "z-0 p-4"}
    `}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      minHeight: isHovered ? 320 : 220,
      transform: isHovered ? "translateY(0px)" : "translateY(0)",
      transformOrigin: "top center",
      willChange: "transform",
    }}
  >
    <img
      src={img}
      alt={label}
      className={`object-cover rounded-xl mb-2 transition-all duration-300 shadow-lg
        ${isHovered ? "w-32 h-32 mt-0" : "w-full h-32 mt-0"}`}
    />
    <span
      className={`font-bold ${
        isHovered ? "text-xl mb-2 mt-2" : "text-lg mt-2"
      } ${color}`}
    >
      {label}
    </span>
    <div
      className={`transition-all duration-300 text-gray-500 text-center text-sm mb-4 overflow-hidden
        ${isHovered ? "max-h-32 opacity-100 mt-2" : "max-h-0 opacity-0 m-0"}`}
    >
      {desc}
    </div>

    {/* ✅ Doğru href'lerle bağlantı */}
    <a
      href={href}
      className={`transition-all duration-300 bg-quaternaryColor text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-secondaryColor
        ${
          isHovered
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      Detay
    </a>
  </div>
);

LinkItem.propTypes = {
  label: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  color: PropTypes.string,
  desc: PropTypes.string,
  href: PropTypes.string, // örnek: "/services", "/projects", "#brands"
  isHovered: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default LinkItem;