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
}) => {
  return (
    <div
      className={`
        group relative w-full sm:w-60 h-[260px]
        rounded-2xl shadow-lg bg-white/10 backdrop-blur
        transition-transform duration-300 ease-out
        ${isHovered ? "scale-[1.04] z-10" : "scale-100 z-0"}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transformOrigin: "center" }}
    >
      {/* Üst görsel */}
      <img
        src={img}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover rounded-2xl"
      />

      {/* Üstten gradient – görseli yumuşatır */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/10 via-black/0 to-black/30 pointer-events-none" />

      {/* Alt panel: hover yokken h-14, hover’da h-36  */}
      <div
        className={`
          absolute left-2 right-2 bottom-2
          rounded-xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-md
          overflow-hidden transition-all duration-300
          ${isHovered ? "h-36" : "h-14"}
        `}
      >
        {/* Başlık satırı */}
        <div className="h-14 px-4 flex items-center">
          <span
            className={`font-semibold ${color} text-base line-clamp-1`}
            title={label}
          >
            {label}
          </span>
        </div>

        {/* İçerik: sadece hover’da görünür */}
        <div
          className={`
            px-4 pb-3 space-y-3 transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          {desc ? (
            <p className="text-xs text-gray-600 line-clamp-2">{desc}</p>
          ) : null}

          <a
            href={href}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold
                       bg-quaternaryColor text-white hover:bg-secondaryColor transition-colors"
          >
            Detay
          </a>
        </div>
      </div>
    </div>
  );
};

LinkItem.propTypes = {
  label: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  color: PropTypes.string,
  desc: PropTypes.string,
  href: PropTypes.string,
  isHovered: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default LinkItem;
