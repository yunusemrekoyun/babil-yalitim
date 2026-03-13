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
  posterPublicId = "",
  fallbackSrc = "/fallback-hero.svg",
  className = "",
}) {
  const videoRef = useRef(null);
  const { allowAmbientVideo, backgroundVideoWidth, imageQuality, videoQuality } =
    usePerformanceProfile();
  const [ready, setReady] = useState(false);

  const mediaKey = posterPublicId || desktopPublicId || "";

  const desktopUrl = useMemo(
    () =>
      getOptimizedVideoUrl(
        { publicId: desktopPublicId, resourceType: "video" },
        { width: backgroundVideoWidth, quality: videoQuality }
      ),
    [backgroundVideoWidth, desktopPublicId, videoQuality]
  );

  const posterUrl = useMemo(
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
          fallbackSrc: posterUrl || fallbackSrc,
        }
      ),
    [fallbackSrc, imageQuality, mobilePublicId, posterUrl]
  );

  useEffect(() => {
    if (!allowAmbientVideo) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    const syncPlayback = () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      video.play().catch(() => {});
    };

    const handleCanPlay = () => setReady(true);

    video.addEventListener("canplay", handleCanPlay);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [allowAmbientVideo, desktopUrl]);

  return (
    <div
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden ${className}`}
    >
      {!allowAmbientVideo || !desktopUrl ? (
        <img
          src={mobileImageUrl || posterUrl || fallbackSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : (
        <>
          <img
            src={posterUrl || fallbackSrc}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
            loading="eager"
            decoding="async"
          />
          <video
            ref={videoRef}
            src={desktopUrl}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={posterUrl || undefined}
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
  posterPublicId: PropTypes.string,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
};
