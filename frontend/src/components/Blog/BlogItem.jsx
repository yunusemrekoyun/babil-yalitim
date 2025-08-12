// src/components/Blog/BlogItem.jsx
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// içerikten kısa özet üret (HTML destekli)
const toExcerpt = (htmlOrText, maxLen = 160) => {
  if (!htmlOrText) return "";
  const txt = String(htmlOrText)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return txt.length <= maxLen ? txt : txt.slice(0, maxLen - 1) + "…";
};

const BlogItem = ({ item, index }) => {
  const navigate = useNavigate();

  const cover =
    item?.cover?.url ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";
  const createdText = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString("tr-TR")
    : "";
  const commentsCount = Number(item?.commentsCount || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden border border-white/30 bg-white/60 
                 backdrop-blur-xl shadow-lg hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
                 transition-all cursor-pointer"
      onClick={() => navigate(`/blog/${item._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/blog/${item._id}`)}
      aria-label={`${item?.title || "Blog"} detayına git`}
    >
      {/* Kapak */}
      <div className="relative w-full h-56 md:h-60 overflow-hidden">
        <img
          src={cover}
          alt={item?.title || "blog kapak"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-90" />
        {createdText && (
          <span className="absolute top-3 right-3 text-[11px] tracking-wide uppercase bg-white/90 text-gray-700 px-2 py-1 rounded-full shadow-md">
            {createdText}
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="p-6">
        <h3 className="text-lg md:text-xl font-semibold text-secondaryColor line-clamp-2">
          {item?.title || "Başlık"}
        </h3>

        {/* Etiketler */}
        {Array.isArray(item?.tags) && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-1 rounded-full bg-quaternaryColor/10 text-quaternaryColor border border-quaternaryColor/30"
              >
                {t}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="text-[11px] text-gray-500">
                +{item.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <p className="mt-3 text-sm text-gray-700 line-clamp-3">
          {toExcerpt(item?.content)}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="h-[2px] w-0 group-hover:w-1/2 bg-quaternaryColor/90 transition-all duration-500" />
          <span className="text-xs text-gray-500">
            {commentsCount > 0 ? `${commentsCount} yorum` : "Yorum yok"}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

BlogItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.shape({
      url: PropTypes.string,
      publicId: PropTypes.string,
      resourceType: PropTypes.oneOf(["image", "video"]),
    }),
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    commentsCount: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default BlogItem;
