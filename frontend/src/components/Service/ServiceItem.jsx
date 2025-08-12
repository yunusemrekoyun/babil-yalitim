import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ServiceItem = ({ service }) => {
  const [hovered, setHovered] = useState(false);

  const media = useMemo(() => {
    const coverUrl =
      service?.cover?.url ||
      service?.imageDataUrl ||
      service?.imageUrl ||
      service?.images?.[0]?.url ||
      "";

    const gallery =
      (service?.images || []).filter((m) => m?.url).map((m) => m.url) ||
      service?.galleryDataUrls ||
      [];

    return { coverUrl, gallery };
  }, [service]);

  return (
    <Link
      to={service?._id ? `/services/${service._id}` : "#"}
      className="group rounded-3xl overflow-hidden border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] block focus:outline-none focus-visible:ring-2 focus-visible:ring-quaternaryColor/60"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${service?.title || "Hizmet"} detayına git`}
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        {media.coverUrl ? (
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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute -inset-y-10 -left-24 w-40 rotate-12 bg-white/25 blur-2xl transition-all duration-700 group-hover:translate-x-[140%]" />

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

        {Array.isArray(media.gallery) && media.gallery.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {media.gallery.slice(0, 4).map((u, i) => (
              <img
                key={i}
                src={u}
                alt={`thumb-${i}`}
                className="h-14 w-full object-cover rounded-lg border pointer-events-none"
                loading="lazy"
              />
            ))}
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
      resourceType: PropTypes.string,
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
