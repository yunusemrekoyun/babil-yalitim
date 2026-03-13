import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlayCircle, PauseCircle } from "lucide-react";
import AdaptiveImage from "../Media/AdaptiveImage";
import {
  getOptimizedVideoUrl,
  getVideoPosterUrl,
  looksVideo,
} from "../../utils/cloudinary";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

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

const ServiceGridItem = ({ item, isCenter, shouldAutoplay, registerVideoRef }) => {
  const videoRef = useRef(null);
  const [isPlayingTouch, setIsPlayingTouch] = useState(false);
  const { detailImageWidth, imageQuality, videoQuality } =
    usePerformanceProfile();

  // Cihaz touch mı? (mobil/tablet vs.)
  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }, []);

  const cover = item?.cover || null;
  const imagesArr = Array.isArray(item?.images) ? item.images : [];
  const { img: firstImage, vid: firstVideo } = pickFirstImageAndVideo(imagesArr);

  const coverIsVideo =
    cover?.resourceType === "video" || looksVideo(cover?.url);

  const videoMedia = coverIsVideo ? cover || cover?.url : firstVideo || null;
  const videoUrl = useMemo(
    () =>
      getOptimizedVideoUrl(videoMedia, {
        width: detailImageWidth,
        quality: videoQuality,
      }),
    [detailImageWidth, videoMedia, videoQuality]
  );

  const previewMedia =
    (!coverIsVideo && (cover || cover?.url)) ||
    firstImage ||
    (coverIsVideo
      ? getVideoPosterUrl(cover || videoMedia, {
          width: detailImageWidth,
          quality: imageQuality,
        })
      : null) ||
    item?.imageDataUrl ||
    item?.imageUrl ||
    null;

  const size =
    "w-[78vw] h-[52vh] sm:w-[320px] sm:h-[480px] object-cover rounded-[22px] shadow-lg";

  // Touch cihazda videoya dokununca oynat/durdur; linke gitmeyi engelle
  const onTouchToggle = (e) => {
    if (!isTouch || !videoUrl || !videoRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlayingTouch(true);
      } else {
        videoRef.current.pause();
        setIsPlayingTouch(false);
      }
    } catch (err) {
      console.error("[ServiceGridItem] touch toggle error:", err);
    }
  };

  useEffect(() => {
    if (isTouch || !isCenter || !videoRef.current) return;

    const video = videoRef.current;

    if (shouldAutoplay) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [isCenter, isTouch, shouldAutoplay]);

  return (
    <Link
      to={item?._id ? `/services/${item._id}` : "#"}
      className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-2xl"
      aria-label={`${item?.title || "Hizmet"} detayına git`}
    >
      {/* Merkez kart: Desktop'ta autoplay, Mobilde dokununca oynasın */}
      {isCenter && videoUrl ? (
        <>
          <video
            ref={(el) => {
              if (registerVideoRef) registerVideoRef(el);
              videoRef.current = el;
            }}
            src={videoUrl}
            muted
            loop
            playsInline
            poster={
              typeof previewMedia === "string" ? previewMedia : undefined
            }
            // ÖNEMLİ: Desktop'ta autoplay; mobilde AUTOPLAY KAPALI
            autoPlay={!isTouch}
            preload={isTouch ? "none" : "metadata"}
            className={size}
            onClick={onTouchToggle}
            onPlay={() => isTouch && setIsPlayingTouch(true)}
            onPause={() => isTouch && setIsPlayingTouch(false)}
            onError={(e) => {
              console.error(
                "[ServiceGridItem] video load ERROR",
                { id: item?._id, title: item?.title },
                "src:",
                e.currentTarget?.currentSrc || e.currentTarget?.src
              );
            }}
          />
          {isTouch && (
            <button
              type="button"
              onClick={onTouchToggle}
              className="absolute inset-0 z-20 grid place-items-center bg-black/0 active:bg-black/10 rounded-[22px]"
              aria-label={isPlayingTouch ? "Videoyu durdur" : "Videoyu oynat"}
            >
              {isPlayingTouch ? (
                <PauseCircle size={56} className="drop-shadow" />
              ) : (
                <PlayCircle size={56} className="drop-shadow" />
              )}
            </button>
          )}
        </>
      ) : previewMedia ? (
        <AdaptiveImage
          media={previewMedia}
          alt={item?.title || "service"}
          className={size}
          sizes="(min-width: 640px) 320px, 88vw"
          widths={[320, 480, 640, 800, 960]}
          quality={imageQuality}
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
  shouldAutoplay: PropTypes.bool,
  registerVideoRef: PropTypes.func,
};

export default ServiceGridItem;
