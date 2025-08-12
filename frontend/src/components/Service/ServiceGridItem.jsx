import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ServiceGridItem = ({ item, isCenter, registerVideoRef }) => {
  const videoFromImages = (item?.images || []).find(
    (m) => m?.resourceType === "video" && m?.url
  )?.url;
  const videoUrl = item?.videoUrl || videoFromImages || null;

  const coverUrl =
    item?.cover?.url ||
    item?.imageDataUrl ||
    item?.imageUrl ||
    item?.images?.[0]?.url ||
    "";

  const galleryUrls =
    (item?.images || [])
      .filter((m) => m?.resourceType !== "video" && m?.url)
      .map((m) => m.url) ||
    item?.galleryDataUrls ||
    [];

  const mediaEl = videoUrl ? (
    <video
      ref={registerVideoRef}
      src={videoUrl}
      muted
      loop
      playsInline
      className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
    />
  ) : (
    <img
      src={coverUrl}
      alt={item?.title || "service"}
      className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
      loading="lazy"
    />
  );

  return (
    <Link
      to={item?._id ? `/services/${item._id}` : "#"}
      className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-xl"
      aria-label={`${item?.title || "Hizmet"} detayına git`}
    >
      {mediaEl}

      {isCenter && (
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
          <p className="text-white text-lg font-semibold mb-3 text-center md:text-left">
            {item?.title}
          </p>

          {Array.isArray(galleryUrls) && galleryUrls.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryUrls.map((u, i) => (
                <img
                  key={i}
                  src={u}
                  alt={`gallery-${i}`}
                  className="w-16 h-16 object-cover rounded-lg border border-white/20 flex-shrink-0 pointer-events-none"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

ServiceGridItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
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
    videoUrl: PropTypes.string,
  }),
  isCenter: PropTypes.bool,
  registerVideoRef: PropTypes.func,
};

export default ServiceGridItem;
