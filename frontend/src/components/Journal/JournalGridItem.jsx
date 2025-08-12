import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const excerpt = (htmlOrText, max = 150) => {
  if (!htmlOrText) return "";
  const txt = String(htmlOrText)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return txt.length <= max ? txt : txt.slice(0, max - 1) + "…";
};

const JournalGridItem = ({ item, index }) => {
  const navigate = useNavigate();
  const prettyDate = item?.date
    ? new Date(item.date).toLocaleDateString("tr-TR")
    : "";
  const cover =
    item?.coverUrl ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden border border-white/30 bg-white/50 
                 backdrop-blur-xl shadow-lg hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
                 transition-all cursor-pointer"
      onClick={() => navigate(`/journals/${item._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/journals/${item._id}`)}
      aria-label={`${item?.title || "Haber"} detayına git`}
    >
      {/* Kapak */}
      <div className="relative w-full h-56 md:h-60 overflow-hidden">
        <img
          src={cover}
          alt={item?.title || "haber görseli"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent opacity-95" />
        {prettyDate && (
          <span className="absolute top-3 right-3 text-[11px] tracking-wide uppercase bg-white/90 text-gray-700 px-2 py-1 rounded-full shadow-md">
            {prettyDate}
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="p-6">
        <h3 className="text-lg md:text-xl font-semibold text-secondaryColor line-clamp-2">
          {item?.title || "Başlık"}
        </h3>
        {item?.content && (
          <p
            className="mt-3 text-sm text-gray-700 line-clamp-3"
            title={excerpt(item.content)}
          >
            {excerpt(item.content)}
          </p>
        )}

        <div className="mt-5 h-[2px] w-0 group-hover:w-1/2 bg-quaternaryColor/90 transition-all duration-500" />
      </div>
    </motion.article>
  );
};

JournalGridItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default JournalGridItem;
