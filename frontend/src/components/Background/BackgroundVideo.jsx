// src/components/Background/BackgroundVideo.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  getMediaUrl,
  getOptimizedImageUrl,
  getOptimizedVideoUrl,
} from "../../utils/media";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

export default function BackgroundVideo({
  desktopVideoUrl = "",
  mobileImageUrl = "",
  mobileVideoUrl = "",
  posterUrl = "",
  fallbackSrc = "/fallback-hero.jpg",
  className = "",
}) {
  const videoRef = useRef(null);
  const resumeTimersRef = useRef([]);
  const didBecomeHiddenRef = useRef(false);
  const {
    backgroundVideoWidth,
    mobileBackgroundVideoWidth,
    imageQuality,
    isMobile,
  } = usePerformanceProfile();
  const [ready, setReady] = useState(false);

  const chosenVideoUrl = isMobile ? mobileVideoUrl || desktopVideoUrl : desktopVideoUrl;
  const shouldUseVideo = Boolean(chosenVideoUrl);
  const priorityProps = { fetchpriority: "high" };

  const videoUrl = useMemo(
    () => getOptimizedVideoUrl(chosenVideoUrl),
    [chosenVideoUrl]
  );

  const fallbackImageUrl = useMemo(() => {
    const imageUrl = (isMobile && mobileImageUrl) || posterUrl || "";
    if (!imageUrl) return fallbackSrc;

    return getOptimizedImageUrl(imageUrl, {
      width: isMobile ? mobileBackgroundVideoWidth : backgroundVideoWidth,
      quality: imageQuality,
      fallbackSrc,
    });
  }, [
    backgroundVideoWidth,
    fallbackSrc,
    imageQuality,
    isMobile,
    mobileBackgroundVideoWidth,
    mobileImageUrl,
    posterUrl,
  ]);

  const placeholderUrl = getMediaUrl(posterUrl) || fallbackImageUrl || fallbackSrc;

  useEffect(() => {
    setReady(false);
  }, [isMobile, shouldUseVideo, videoUrl]);

  useEffect(() => {
    if (!shouldUseVideo || !videoUrl) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    const clearResumeTimers = () => {
      if (!resumeTimersRef.current.length) return;
      resumeTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      resumeTimersRef.current = [];
    };

    const markReady = () => {
      window.requestAnimationFrame(() => setReady(true));
    };

    const attemptPlayback = () => {
      if (document.hidden) return;
      video.play().catch(() => {});
    };

    const scheduleResume = () => {
      clearResumeTimers();
      [0, 180, 520].forEach((delay) => {
        const timer = window.setTimeout(() => {
          attemptPlayback();
        }, delay);
        resumeTimersRef.current.push(timer);
      });
    };

    const syncPlayback = () => {
      if (document.hidden) {
        didBecomeHiddenRef.current = true;
        clearResumeTimers();
        video.pause();
        return;
      }

      if (didBecomeHiddenRef.current || video.paused) {
        didBecomeHiddenRef.current = false;
        scheduleResume();
      }
    };

    const handleResumeSignal = () => {
      if (document.hidden || !video.paused) return;
      scheduleResume();
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.poster = placeholderUrl || "";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", markReady);
    video.addEventListener("timeupdate", markReady, { once: true });

    video.load();
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("focus", handleResumeSignal);
    window.addEventListener("pageshow", handleResumeSignal);
    attemptPlayback();

    return () => {
      clearResumeTimers();
      didBecomeHiddenRef.current = false;
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("playing", markReady);
      video.removeEventListener("timeupdate", markReady);
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("focus", handleResumeSignal);
      window.removeEventListener("pageshow", handleResumeSignal);
    };
  }, [placeholderUrl, shouldUseVideo, videoUrl]);

  return (
    <div
      className={`fixed inset-0 h-full w-full -z-10 overflow-hidden bg-slate-950 ${className}`}
      data-ambient-video={
        shouldUseVideo ? (isMobile ? "mobile" : "desktop") : "poster"
      }
    >
      {!shouldUseVideo || !videoUrl ? (
        <img
          src={placeholderUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover bg-slate-950"
          loading="eager"
          decoding="async"
          {...priorityProps}
        />
      ) : (
        <>
          <img
            src={placeholderUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover bg-slate-950 transition-opacity duration-500 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
            loading="eager"
            decoding="async"
            {...priorityProps}
          />
          <video
            ref={videoRef}
            src={videoUrl}
            className={`absolute inset-0 h-full w-full object-cover bg-slate-950 transition-opacity duration-500 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={placeholderUrl || undefined}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/20" />
    </div>
  );
}

BackgroundVideo.propTypes = {
  desktopVideoUrl: PropTypes.string,
  mobileImageUrl: PropTypes.string,
  mobileVideoUrl: PropTypes.string,
  posterUrl: PropTypes.string,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
};
