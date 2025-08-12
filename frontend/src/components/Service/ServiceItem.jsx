import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

/**
 * Dikey (9:16) kart. Kapak image/video destekler.
 * - Kapak video ise, kart görünümdeyken otomatik oynatılır; görünümden çıkınca durur.
 * - Hover’da hafif zoom, üstte başlık ve chip’ler.
 */
const ServiceItem = ({ service }) => {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.45 });

  const media = useMemo(() => {
    const coverType = service?.cover?.resourceType || "image";
    const isVideo = coverType === "video";
    const coverUrl =
      service?.cover?.url ||
      service?.imageDataUrl ||
      service?.imageUrl ||
      service?.images?.[0]?.url ||
      "";
    return { isVideo, coverUrl };
  }, [service]);

  // görünüm durumuna göre video kontrolü
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (inView) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    } catch {
      /* sessiz geç */
    }
  }, [inView]);

  return (
    <Link
      to={service?._id ? `/services/${service._id}` : "#"}
      className="group rounded-3xl overflow-hidden border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)] block focus:outline-none focus-visible:ring-2 focus-visible:ring-quaternaryColor/60 transition-shadow"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${service?.title || "Hizmet"} detayına git`}
      ref={inViewRef}
    >
      {/* Media: 9:16 */}
      <div className="relative aspect-[9/16] overflow-hidden">
        {media.isVideo ? (
          <video
            ref={videoRef}
            src={media.coverUrl}
            muted
            loop
            playsInline
            poster="" // opsiyonel: ayrı bir poster istenirse eklenir
            className={`h-full w-full object-cover transition-transform duration-700 ${
              hovered ? "scale-105" : "scale-100"
            }`}
          />
        ) : media.coverUrl ? (
          <img
            src={media.coverUrl}
            alt={service?.title || "service"}
            className={`h-full w-full object-cover transition-transform duration-700 ${
              hovered ? "scale-105" : "scale-100"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-gray-200 to-gray-300" />
        )}

        {/* üstten parlama + altta gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute -inset-y-10 -left-24 w-40 rotate-12 bg-white/25 blur-2xl transition-all duration-700 group-hover:translate-x-[140%]" />

        {/* Başlık + tip/kategori */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold drop-shadow-sm">
            {service?.title || "Hizmet"}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {service?.type && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur">
                {service.type}
              </span>
            )}
            {service?.category && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur">
                {service.category}
              </span>
            )}
          </div>
        </div>

        {/* video için “play wave” ipucu */}
        {media.isVideo && (
          <div className="absolute top-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full border border-white/20 backdrop-blur-sm">
            otomatik oynatım
          </div>
        )}
      </div>

      {/* Alt içerik */}
      <div className="p-4">
        {service?.description && (
          <p
            className="text-sm text-gray-700"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={service.description}
          >
            {service.description}
          </p>
        )}

        {Array.isArray(service?.usageAreas) &&
          service.usageAreas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {service.usageAreas.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {t}
                </span>
              ))}
              {service.usageAreas.length > 4 && (
                <span className="text-[11px] text-gray-400">
                  +{service.usageAreas.length - 4}
                </span>
              )}
            </div>
          )}
      </div>
    </Link>
  );
};

ServiceItem.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    usageAreas: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
      publicId: PropTypes.string,
      resourceType: PropTypes.string, // "image" | "video"
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        publicId: PropTypes.string,
        resourceType: PropTypes.string,
      })
    ),
    // legacy:
    imageDataUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    galleryDataUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ServiceItem;
