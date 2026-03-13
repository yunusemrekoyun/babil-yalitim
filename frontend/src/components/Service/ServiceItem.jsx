// src/components/Service/ServiceItem.jsx
import PropTypes from "prop-types";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdaptiveImage from "../Media/AdaptiveImage";
import {
  getOptimizedVideoUrl,
  getVideoPosterUrl,
} from "../../utils/cloudinary";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

/**
 * Dikey (9:16) kart.
 * - Video varsa: sadece HOVER sırasında oynar, mouse ayrılınca durur ve başa sarar.
 * - Hover’da hafif zoom efekti kalır.
 * - “otomatik oynatım” rozeti kaldırıldı.
 */
const ServiceItem = ({ service }) => {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const { cardImageWidth, detailImageWidth, imageQuality, videoQuality } =
    usePerformanceProfile();

  const { isVideo, coverMedia, coverUrl, posterMedia } = useMemo(() => {
    const coverType = service?.cover?.resourceType || "image";
    const isVideo = coverType === "video";
    const coverMedia =
      service?.cover ||
      service?.cover?.url ||
      service?.imageDataUrl ||
      service?.imageUrl ||
      service?.images?.[0]?.url ||
      "";
    const coverUrl = service?.cover?.url || service?.imageDataUrl || service?.imageUrl || service?.images?.[0]?.url || "";

    // Video için poster (varsa galeriden ilk image’i kullan)
    const posterMedia = isVideo
      ? (service?.images || []).find(
          (m) => (m?.resourceType || "image") === "image" && m?.url
        ) || service?.cover
      : undefined;

    return { isVideo, coverMedia, coverUrl, posterMedia };
  }, [service]);

  const optimizedCoverUrl = useMemo(
    () =>
      isVideo
        ? getOptimizedVideoUrl(coverMedia, {
            width: detailImageWidth,
            quality: videoQuality,
          })
        : coverUrl,
    [coverMedia, coverUrl, detailImageWidth, isVideo, videoQuality]
  );

  const posterUrl = useMemo(
    () =>
      posterMedia?.resourceType === "video"
        ? getVideoPosterUrl(posterMedia, {
            width: cardImageWidth,
            quality: imageQuality,
          })
        : posterMedia,
    [cardImageWidth, imageQuality, posterMedia]
  );

  const handleEnter = () => {
    setHovered(true);
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      v.play().catch(() => {});
    } catch {
      console.error("Failed to play video");
    }
  };

  const handleLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {
      console.error("Failed to pause video");
    }
  };

  return (
    <Link
      to={service?._id ? `/services/${service._id}` : "#"}
      className="transform-gpu-soft group block overflow-hidden rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-quaternaryColor/60 transition-shadow"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      aria-label={`${service?.title || "Hizmet"} detayına git`}
    >
      {/* Media: 9:16 */}
      <div className="relative aspect-[9/16] overflow-hidden">
        {isVideo ? (
          <video
            ref={videoRef}
            src={optimizedCoverUrl}
            muted
            loop
            playsInline
            // hover ile oynatılacağı için autoPlay yok
            poster={posterUrl}
            preload="none"
            className={`h-full w-full object-cover transition-transform duration-700 ${
              hovered ? "scale-105" : "scale-100"
            }`}
          />
        ) : coverUrl ? (
          <AdaptiveImage
            media={coverMedia}
            alt={service?.title || "service"}
            className={`h-full w-full object-cover transition-transform duration-700 ${
              hovered ? "scale-105" : "scale-100"
            }`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 80vw"
            widths={[320, 480, 640, 800, 960]}
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
    imageDataUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    galleryDataUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ServiceItem;
