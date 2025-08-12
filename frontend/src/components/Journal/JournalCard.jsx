import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const JournalCard = ({ item, index }) => {
  const navigate = useNavigate();
  const dateText = item?.date
    ? new Date(item.date).toLocaleDateString("tr-TR")
    : "";
  const imgSrc =
    item?.coverUrl ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden border border-white/30 bg-white/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
      onClick={() => navigate(`/journals/${item._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/journals/${item._id}`)}
      aria-label={`${item?.title || "Haber"} detayına git`}
    >
      <div className="relative w-full h-56 md:h-60 overflow-hidden">
        <img
          src={imgSrc}
          alt={item?.title || "haber görseli"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-90" />
        {dateText && (
          <span className="absolute top-3 right-3 text-[11px] tracking-wide uppercase bg-white/85 text-gray-700 px-2 py-1 rounded-full shadow-md">
            {dateText}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg md:text-xl font-semibold text-secondaryColor line-clamp-2">
          {item?.title || "Başlık"}
        </h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3">
          {item?.excerpt || ""}
        </p>
        <div className="mt-4 h-[2px] w-0 group-hover:w-full bg-quaternaryColor/90 transition-all duration-500" />
      </div>
    </motion.article>
  );
};

JournalCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
    excerpt: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default JournalCard;
