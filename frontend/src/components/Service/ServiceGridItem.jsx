import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

// resourceType yoksa uzantıdan tahmin
const looksVideo = (u) =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(u || ""));

const pickFirstImageAndVideo = (images = []) => {
  let img = null;
  let vid = null;
  for (const m of images) {
    const url = m?.url;
    if (!url) continue;

    const isImg =
      m?.resourceType === "image" || (!m?.resourceType && !looksVideo(url));
    const isVid =
      m?.resourceType === "video" || (!m?.resourceType && looksVideo(url));

    if (isImg && !img) img = url;
    if (isVid && !vid) vid = url;
    if (img && vid) break;
  }
  return { img, vid };
};

// Cloudinary video -> jpg thumb (ilk kare)
const cloudinaryVideoThumb = (publicId) => {
  if (!CLOUD || !publicId) return null;
  // örnek: https://res.cloudinary.com/<cloud>/video/upload/so_0/<publicId>.jpg
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_0/${publicId}.jpg`;
};

const ServiceGridItem = ({ item, isCenter, registerVideoRef }) => {
  const cover = item?.cover || null;
  const imagesArr = Array.isArray(item?.images) ? item.images : [];
  const { img: firstImage, vid: firstVideo } =
    pickFirstImageAndVideo(imagesArr);

  const coverIsVideo =
    cover?.resourceType === "video" || looksVideo(cover?.url);

  // merkezde oynatılacak video kaynağı
  const videoUrl = coverIsVideo ? cover?.url : firstVideo || null;

  // ÖNİZLEME görseli (yan kartlar için MUTLAKA image)
  let previewSrc =
    // 1) kapak image ise kapak
    (!coverIsVideo && cover?.url) ||
    // 2) galerideki ilk image
    firstImage ||
    // 3) kapak video ise cloudinary thumb
    (coverIsVideo && cloudinaryVideoThumb(cover?.publicId)) ||
    // 4) legacy alanlar
    item?.imageDataUrl ||
    item?.imageUrl ||
    null;

  // Yan kartlarda asla video render etme
  const showVideo = Boolean(isCenter && videoUrl);

  const size =
    "w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl";

  return (
    <Link
      to={item?._id ? `/services/${item._id}` : "#"}
      className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-xl"
      aria-label={`${item?.title || "Hizmet"} detayına git`}
    >
      {showVideo ? (
        <video
          ref={registerVideoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          poster={previewSrc || undefined}
          autoPlay
          className={size}
        />
      ) : previewSrc ? (
        <img src={previewSrc} alt={item?.title || "service"} className={size} />
      ) : videoUrl ? (
        // thumb çıkarılamadıysa son çare
        <video
          src={videoUrl}
          muted
          playsInline
          preload="metadata"
          className={size}
          aria-hidden="true"
        />
      ) : (
        <div className={`${size} bg-white/10 border border-white/20`} />
      )}

      {/* Overlay sadece merkezde */}
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
        resourceType: PropTypes.string,
      })
    ),
    imageDataUrl: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  isCenter: PropTypes.bool,
  registerVideoRef: PropTypes.func,
};

export default ServiceGridItem;
