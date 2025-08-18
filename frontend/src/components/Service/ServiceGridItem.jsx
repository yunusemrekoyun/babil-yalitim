import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

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

// Cloudinary video -> thumb
const cloudinaryVideoThumb = (publicId) => {
  if (!CLOUD || !publicId) return null;
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_0/${publicId}.jpg`;
};

const ServiceGridItem = ({ item, isCenter, registerVideoRef }) => {
  const cover = item?.cover || null;
  const imagesArr = Array.isArray(item?.images) ? item.images : [];
  const { img: firstImage, vid: firstVideo } = pickFirstImageAndVideo(imagesArr);

  const coverIsVideo =
    cover?.resourceType === "video" || looksVideo(cover?.url);

  const videoUrl = coverIsVideo ? cover?.url : firstVideo || null;

  let previewSrc =
    (!coverIsVideo && cover?.url) ||
    firstImage ||
    (coverIsVideo && cloudinaryVideoThumb(cover?.publicId)) ||
    item?.imageDataUrl ||
    item?.imageUrl ||
    null;

  /**
   * Boyutlar:
   * - Mobilde biraz daha geniş ve kısa (kart ile buton arasında boşluk kalsın)
   * - Desktop’ta mevcut ölçüler korunuyor
   */
  const size =
    "w-[78vw] h-[52vh] sm:w-[320px] sm:h-[480px] object-cover rounded-[22px] shadow-lg";

  return (
    <Link
      to={item?._id ? `/services/${item._id}` : "#"}
      className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-2xl"
      aria-label={`${item?.title || "Hizmet"} detayına git`}
    >
      {isCenter && videoUrl ? (
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
        <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-4 rounded-[22px]">
          <p className="text-white text-lg font-semibold mb-1 text-center sm:text-left">
            {item?.title}
          </p>
          {item?.type && (
            <span className="self-center sm:self-start inline-block text-[11px] px-2 py-1 rounded-full bg-white/20 border border-white/30 backdrop-blur">
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