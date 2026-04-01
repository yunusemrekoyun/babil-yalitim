// src/components/Background/BackgroundVideo.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  getOptimizedImageUrl,
  getOptimizedVideoUrl,
  getVideoPosterUrl,
} from "../../utils/cloudinary";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

export default function BackgroundVideo({
  desktopPublicId,
  mobilePublicId = "",
  mobileVideoPublicId = "",
  posterPublicId = "",
  fallbackSrc = "/fallback-hero.jpg",
  className = "",
}) {
  const videoRef = useRef(null);
  const {
    backgroundVideoWidth,
    mobileBackgroundVideoWidth,
    imageQuality,
    videoQuality,
    isMobile,
  } = usePerformanceProfile();
  const [ready, setReady] = useState(false);

  const mediaKey = posterPublicId || desktopPublicId || "";
  const chosenVideoPublicId = isMobile
    ? mobileVideoPublicId || desktopPublicId
    : desktopPublicId;
  const chosenVideoWidth = isMobile
    ? mobileBackgroundVideoWidth
    : backgroundVideoWidth;
  const chosenVideoQuality = isMobile ? "auto:eco" : videoQuality;
  const shouldUseVideo = Boolean(chosenVideoPublicId);

  const videoUrl = useMemo(
    () =>
      getOptimizedVideoUrl(
        { publicId: chosenVideoPublicId, resourceType: "video" },
        { width: chosenVideoWidth, quality: chosenVideoQuality }
      ),
    [chosenVideoPublicId, chosenVideoQuality, chosenVideoWidth]
  );

  const desktopPosterUrl = useMemo(
    () =>
      getVideoPosterUrl(
        { publicId: mediaKey, resourceType: "video" },
        { width: backgroundVideoWidth, quality: imageQuality }
      ),
    [backgroundVideoWidth, imageQuality, mediaKey]
  );

  const mobileImageUrl = useMemo(
    () =>
      getOptimizedImageUrl(
        { publicId: mobilePublicId, resourceType: "image" },
        {
          width: 960,
          quality: imageQuality,
          fallbackSrc: desktopPosterUrl || fallbackSrc,
        }
      ),
    [desktopPosterUrl, fallbackSrc, imageQuality, mobilePublicId]
  );
  const activePosterUrl = isMobile
    ? mobileImageUrl || desktopPosterUrl || fallbackSrc
    : desktopPosterUrl || fallbackSrc;

  useEffect(() => {
    setReady(false);
  }, [isMobile, shouldUseVideo, videoUrl]);

  useEffect(() => {
    if (!shouldUseVideo) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    const markReady = () => setReady(true);

    // iOS Safari autoplay davranisi daha guvenilir olsun.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const syncPlayback = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      video.play().catch(() => {});
    };

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", markReady);
    video.load();
    if (video.readyState >= 2) markReady();
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("playing", markReady);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [shouldUseVideo, videoUrl]);

  return (
    <div
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden ${className}`}
      data-ambient-video={shouldUseVideo ? (isMobile ? "mobile" : "desktop") : "poster"}
    >
      {!shouldUseVideo || !videoUrl ? (
        <img
          src={activePosterUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : (
        <>
          <img
            src={activePosterUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
            loading="eager"
            decoding="async"
          />
          <video
            ref={videoRef}
            src={videoUrl}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={activePosterUrl || undefined}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/20" />
    </div>
  );
}

BackgroundVideo.propTypes = {
  desktopPublicId: PropTypes.string.isRequired,
  mobilePublicId: PropTypes.string,
  mobileVideoPublicId: PropTypes.string,
  posterPublicId: PropTypes.string,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
};
