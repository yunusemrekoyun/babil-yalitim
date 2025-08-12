// src/components/Service/ServiceGridItem.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ServiceGridItem = ({ item, isCenter, registerVideoRef }) => {
  // Olası video kaynağı (backend artık video da dönebiliyor)
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

  const mediaEl = videoUrl ? (
    <video
      ref={registerVideoRef}
      src={videoUrl}
      muted
      loop
      playsInline
      // poster ile ilk frame yerine cover gösterimi daha temiz
      poster={coverUrl || undefined}
      // merkezdeyken autoplay, diğerlerinde programatik olarak zaten pauselayacağız
      autoPlay={isCenter}
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

      {/* Sadece başlık overlay; küçük galeri/thumb’lar kaldırıldı */}
      {isCenter && (
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
          <p className="text-white text-lg font-semibold mb-1 text-center md:text-left">
            {item?.title}
          </p>
          {item?.type && (
            <span className="self-center md:self-start inline-block text-[11px] px-2 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur">
              {item.type}
            </span>
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
    type: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
      publicId: PropTypes.string,
      resourceType: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        publicId: PropTypes.string,
        resourceType: PropTypes.string, // image | video
      })
    ),
    // legacy alanlar:
    imageDataUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    galleryDataUrls: PropTypes.arrayOf(PropTypes.string),
    videoUrl: PropTypes.string,
  }),
  isCenter: PropTypes.bool,
  registerVideoRef: PropTypes.func,
};

export default ServiceGridItem;
