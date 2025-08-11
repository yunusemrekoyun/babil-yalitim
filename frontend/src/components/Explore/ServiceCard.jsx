import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";

const ServiceCard = ({ service, index }) => {
  const videoRef = useRef(null);

  const cover = useMemo(() => {
    // Önce video varsa onu kapak olarak kullanacağız (hover’da oynatacağız)
    if (service.videoUrl) return { type: "video", src: service.videoUrl };

    // Sonra base64 image’lar
    if (service.imageDataUrl) return { type: "img", src: service.imageDataUrl };

    if (Array.isArray(service.galleryDataUrls) && service.galleryDataUrls[0])
      return { type: "img", src: service.galleryDataUrls[0] };

    // Eski alan fallback
    if (service.imageUrl) return { type: "img", src: service.imageUrl };

    // Son çare placeholder
    return {
      type: "img",
      src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzIwJyBoZWlnaHQ9JzI0MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+",
    };
  }, [service]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden border border-white/60
                 bg-white/50 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                 hover:shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition-shadow"
    >
      {/* Media */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        {cover.type === "video" ? (
          <video
            ref={videoRef}
            src={cover.src}
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() => videoRef.current?.play()}
            onMouseLeave={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          />
        ) : (
          <img
            src={cover.src}
            alt={service.title || "service"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* parlayan kenar */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute -inset-[1px] rounded-2xl border border-white/40" />
        </div>

        {/* üst rozetler */}
        <div className="absolute top-3 left-3 flex gap-2">
          {service.category && (
            <span className="text-[11px] md:text-xs px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur border border-white/20">
              {service.category}
            </span>
          )}
          {Array.isArray(service.tags) &&
            service.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[11px] md:text-xs px-2.5 py-1 rounded-full bg-white/60 text-secondaryColor border border-white/70"
              >
                {t}
              </span>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg md:text-xl font-semibold text-secondaryColor line-clamp-2">
          {service.title || "Hizmet"}
        </h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3">
          {service.description || "Açıklama yakında eklenecek."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {service.updatedAt
              ? new Date(service.updatedAt).toLocaleDateString("tr-TR")
              : ""}
          </span>

          <Link
            to={`/services`} // isterseniz detaya ayrı rota açarız
            className="inline-flex items-center gap-1 text-quaternaryColor hover:gap-2 transition-all text-sm font-semibold"
          >
            Detaylar <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    videoUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    imageDataUrl: PropTypes.string,
    galleryDataUrls: PropTypes.array,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    updatedAt: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ServiceCard;
