// src/components/Background/BackgroundVideo.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

const cldVideo = (publicId) =>
  CLOUD && publicId
    ? `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto/${publicId}.mp4`
    : "";

const cldPoster = (publicId) =>
  CLOUD && publicId
    ? `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,f_jpg,q_auto/${publicId}.jpg`
    : "";

export default function BackgroundVideo({
  desktopPublicId,
  mobilePublicId = "",
  posterPublicId = "",
  className = "",
}) {
  const vA = useRef(null);
  const vB = useRef(null);
  const [active, setActive] = useState("A");

  const desktopUrl = useMemo(
    () => cldVideo(desktopPublicId),
    [desktopPublicId]
  );
  const mobileUrl = useMemo(
    () => cldVideo(mobilePublicId || desktopPublicId),
    [mobilePublicId, desktopPublicId]
  );
  const posterUrl = useMemo(
    () =>
      posterPublicId
        ? cldPoster(posterPublicId)
        : cldPoster(desktopPublicId || ""),
    [posterPublicId, desktopPublicId]
  );

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const A = vA.current;
    const B = vB.current;
    if (!A || !B) return;

    A.muted = B.muted = true;
    A.playsInline = B.playsInline = true;
    A.preload = B.preload = "auto";

    const playSafe = (el) => el.play().catch(() => {});

    let timerId;

    const loop = () => {
      const cur = active === "A" ? A : B;
      const next = active === "A" ? B : A;

      // reset next
      try {
        next.currentTime = 0.01;
      } catch {
        console.error();
      }
      next.style.opacity = 0;
      playSafe(next);

      // fade
      next.style.transition = "opacity 1s linear";
      cur.style.transition = "opacity 1s linear";
      next.style.opacity = 1;
      cur.style.opacity = 0;

      setActive((p) => (p === "A" ? "B" : "A"));

      timerId = setTimeout(loop, 30000); // 30 saniye sonra tekrar
    };

    // başlat
    playSafe(A);
    A.style.opacity = 1;
    B.style.opacity = 0;
    timerId = setTimeout(loop, 30000);

    return () => clearTimeout(timerId);
  }, [active, isMobile]);

  return (
    <div
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden ${className}`}
    >
      {isMobile ? (
        <video
          src={mobileUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl || undefined}
        />
      ) : (
        <>
          <video
            ref={vA}
            src={desktopUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            poster={posterUrl || undefined}
          />
          <video
            ref={vB}
            src={desktopUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            poster={posterUrl || undefined}
            style={{ opacity: 0 }}
          />
        </>
      )}
    </div>
  );
}

BackgroundVideo.propTypes = {
  desktopPublicId: PropTypes.string.isRequired,
  mobilePublicId: PropTypes.string,
  posterPublicId: PropTypes.string,
  className: PropTypes.string,
};
