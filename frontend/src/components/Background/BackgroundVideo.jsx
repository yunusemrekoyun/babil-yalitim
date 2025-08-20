// src/components/Background/BackgroundVideo.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

// Cloudinary video URL
const cldVideo = (publicId) =>
  CLOUD && publicId
    ? `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto/${publicId}.mp4`
    : "";

// Cloudinary poster (ilk kare) URL
const cldPoster = (publicId) =>
  CLOUD && publicId
    ? `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,f_jpg,q_auto/${publicId}.jpg`
    : "";

export default function BackgroundVideo({
  desktopPublicId,
  posterPublicId = "",
  className = "",
}) {
  const vA = useRef(null);
  const vB = useRef(null);

  const desktopUrl = useMemo(
    () => cldVideo(desktopPublicId),
    [desktopPublicId]
  );

  // Poster öncelik: posterPublicId -> desktopPublicId
  const posterUrl = useMemo(
    () => cldPoster(posterPublicId || desktopPublicId || ""),
    [posterPublicId, desktopPublicId]
  );

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // DESKTOP: 30 sn’de bir A/B videolar arasında yumuşak geçiş
  useEffect(() => {
    if (isMobile) return; // mobilde video yok

    const A = vA.current;
    const B = vB.current;
    if (!A || !B) return;

    A.muted = B.muted = true;
    A.playsInline = B.playsInline = true;
    A.preload = B.preload = "auto";

    const playSafe = (el) => el?.play().catch(() => {});

    // başlat
    A.style.opacity = 1;
    B.style.opacity = 0;
    playSafe(A);

    let timerId = 0;
    const DURATION_MS = 30000; // 30sn sabit
    const FADE_MS = 1000;

    const crossFade = (fromEl, toEl) => {
      if (!toEl) return;
      try {
        toEl.currentTime = 0.01;
      } catch (err) {
        console.warn("Video reset error:", err);
      }
      playSafe(toEl);

      toEl.style.transition = `opacity ${FADE_MS}ms linear`;
      fromEl.style.transition = `opacity ${FADE_MS}ms linear`;
      toEl.style.opacity = 1;
      fromEl.style.opacity = 0;
    };

    let active = "A";

    const tick = () => {
      if (active === "A") {
        crossFade(A, B);
        active = "B";
      } else {
        crossFade(B, A);
        active = "A";
      }
      timerId = window.setTimeout(tick, DURATION_MS);
    };

    timerId = window.setTimeout(tick, DURATION_MS);

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [isMobile, desktopUrl]);

  return (
    <div
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden ${className}`}
    >
      {isMobile ? (
        // 🔹 MOBİL: SADECE GÖRSEL (video yok)
        <img
          src={posterUrl || "/fallback-hero.jpg"}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      ) : (
        // 🔹 DESKTOP: Çift video, 30sn’de bir yumuşak fade ile sıfırdan başlar
        <>
          <video
            ref={vA}
            src={desktopUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            poster={posterUrl || undefined}
          />
          <video
            ref={vB}
            src={desktopUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            style={{ opacity: 0 }}
            poster={posterUrl || undefined}
          />
        </>
      )}
    </div>
  );
}

BackgroundVideo.propTypes = {
  desktopPublicId: PropTypes.string.isRequired,
  posterPublicId: PropTypes.string,
  className: PropTypes.string,
};
