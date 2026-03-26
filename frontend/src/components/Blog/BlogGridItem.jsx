import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdaptiveImage from "../Media/AdaptiveImage";
import { toRichContentExcerpt } from "../../utils/richContent";

const BlogGridItem = ({ item, index }) => {
  const navigate = useNavigate();

  const coverUrl =
    item?.cover?.url ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

  const createdText = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString("tr-TR")
    : "";

  const commentsCount = Number(item?.commentsCount || 0);
  const excerpt = toRichContentExcerpt(item?.content, 140);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="transform-gpu-soft group rounded-2xl overflow-hidden border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-[0_18px_50px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition-all cursor-pointer"
      onClick={() => navigate(`/blog/${item._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/blog/${item._id}`)}
      aria-label={`${item?.title || "Blog"} detayına git`}
    >
      {/* Kapak */}
      <div className="relative w-full h-44 md:h-56 overflow-hidden">
        <AdaptiveImage
          media={item?.cover || coverUrl}
          alt={item?.title || "blog kapak"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          widths={[320, 480, 640, 800, 960]}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        {createdText && (
          <span className="absolute top-3 right-3 text-[11px] tracking-wide uppercase bg-white/90 text-gray-700 px-2 py-1 rounded-full shadow">
            {createdText}
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="p-5">
        <h3 className="text-lg md:text-xl font-semibold text-secondaryColor line-clamp-2">
          {item?.title || "Başlık"}
        </h3>

        {Array.isArray(item?.tags) && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-1 rounded-full bg-quaternaryColor/10 text-quaternaryColor border border-quaternaryColor/30"
              >
                {t}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[11px] text-gray-500">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="mt-3 text-sm text-gray-700 line-clamp-3">{excerpt}</p>

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

BlogGridItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.shape({ url: PropTypes.string }),
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    commentsCount: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default BlogGridItem;
