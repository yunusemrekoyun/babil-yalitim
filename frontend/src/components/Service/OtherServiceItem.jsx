import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const OtherServiceItem = ({ service }) => {
  const isVideo = service?.cover?.resourceType === "video";

  const img =
    service?.cover?.url ||
    service?.imageDataUrl ||
    service?.imageUrl ||
    service?.images?.find((m) => m?.url)?.url ||
    "";

  return (
    <Link
      to={`/services/${service._id}`}
      className="group flex gap-3 rounded-lg overflow-hidden border bg-white hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-quaternaryColor/60"
      aria-label={`${service?.title || "Hizmet"} detayına git`}
    >
      <div className="w-16 h-20 overflow-hidden shrink-0">
        {isVideo ? (
          <video
            src={img}
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={img}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex-1 py-2 pr-2">
        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {service.title}
        </h4>
        {service.category && (
          <p className="text-xs text-gray-500 mt-1">{service.category}</p>
        )}
      </div>
    </Link>
  );
};

OtherServiceItem.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    category: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
      resourceType: PropTypes.string, // "image" | "video"
    }),
    imageDataUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        resourceType: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default OtherServiceItem;
