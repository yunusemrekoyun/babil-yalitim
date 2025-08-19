// src/components/Background/BackgroundVideo.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";


/** Cloudinary URL helper'ları */
const cldVideo = (publicId, { mobile = false } = {}) => {
  if (!CLOUD || !publicId) return "";
  // f_auto,q_auto → format/kalite otomatik
  // İstersen mobile varyantına bitrate ekleyebilirsin (örn: br_1000k)
  const trans = mobile ? "f_auto,q_auto" : "f_auto,q_auto";
  return `https://res.cloudinary.com/${CLOUD}/video/upload/${trans}/${publicId}.mp4`;
};

const cldPoster = (publicId) => {
  if (!CLOUD || !publicId) return "";
  // ilk kareden poster
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,f_jpg,q_auto/${publicId}.jpg`;
};

/**
 * Props:
 * - desktopPublicId (zorunlu)
 * - mobilePublicId  (opsiyonel; yoksa desktop kullanılır)
 * - posterPublicId  (opsiyonel; yoksa videodan kare alınır)
 * - className       (container için)
 */
export default function BackgroundVideo({
  desktopPublicId,
  mobilePublicId,
  posterPublicId,
  className,
}) {
  const vA = useRef(null);
  const vB = useRef(null);
  const lightRef = useRef(null);

  const desktopUrl = useMemo(
    () => cldVideo(desktopPublicId),
    [desktopPublicId]
  );
  const mobileUrl = useMemo(
    () => cldVideo(mobilePublicId || desktopPublicId, { mobile: true }),
    [mobilePublicId, desktopPublicId]
  );
  const posterUrl = useMemo(
    () =>
      posterPublicId
        ? cldPoster(posterPublicId)
        : cldPoster(desktopPublicId || ""),
    [posterPublicId, desktopPublicId]
  );

  // ortam sinyalleri
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const conn =
    (typeof navigator !== "undefined" &&
      (navigator.connection ||
        navigator.webkitConnection ||
        navigator.mozConnection)) ||
    null;

  const saveData = !!conn?.saveData;
  const slowNet = ["slow-2g", "2g"].includes(conn?.effectiveType || "");

  const disableBgVideo =
    prefersReduced || saveData || slowNet || !desktopUrl || !CLOUD;
  const useLightMode = isMobile || disableBgVideo;

  // masaüstü: çift katman cross‑fade
  const stateRef = useRef({ active: "A", fading: false });

  useEffect(() => {
    if (useLightMode) return;

    const A = vA.current;
    const B = vB.current;
    if (!A || !B) return;

    const OVERLAP = 1.2;
    const FADE_MS = OVERLAP * 1000;

    A.preload = "metadata";
    B.preload = "metadata";
    A.muted = true;
    B.muted = true;
    A.playsInline = true;
    B.playsInline = true;
    A.style.willChange = "opacity";
    B.style.willChange = "opacity";

    const playSafe = (el) => {
      if (!el) return;
      el.play().catch(() => {
        // autoplay engellenirse sessizce geç
      });
    };

    const startBoth = () => {
      try {
        A.currentTime = 0.01;
        B.currentTime = 0.01;
      } catch {
        // bazı tarayıcılarda izin verilmeyebilir
      }
      A.style.opacity = 1;
      B.style.opacity = 0;
      playSafe(A);
    };

    const crossFade = (fromEl, toEl) => {
      stateRef.current.fading = true;
      try {
        toEl.currentTime = 0.01;
      } catch {
        // izin verilmeyebilir, sorun değil
      }
      playSafe(toEl);

      toEl.style.transition = `opacity ${FADE_MS}ms linear`;
      fromEl.style.transition = `opacity ${FADE_MS}ms linear`;
      toEl.style.opacity = 1;
      fromEl.style.opacity = 0;

      window.setTimeout(() => {
        try {
          fromEl.pause();
        } catch {
          // pause başarısız olabilir, ignore
        }
        stateRef.current.active = stateRef.current.active === "A" ? "B" : "A";
        stateRef.current.fading = false;
      }, FADE_MS + 30);
    };

    let rafId = 0;
    const tick = () => {
      const { active, fading } = stateRef.current;
      const cur = active === "A" ? A : B;
      const other = active === "A" ? B : A;

      if (!cur.duration || Number.isNaN(cur.duration)) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }
      if (!fading && cur.currentTime >= Math.max(0, cur.duration - OVERLAP)) {
        crossFade(cur, other);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const onReady = () => {
      startBoth();
      stateRef.current.active = "A";
      rafId = window.requestAnimationFrame(tick);
    };

    const readyCheck = () => {
      if (A.readyState >= 1 && B.readyState >= 1) onReady();
    };
    const onMetaA = () => readyCheck();
    const onMetaB = () => readyCheck();

    A.addEventListener("loadedmetadata", onMetaA);
    B.addEventListener("loadedmetadata", onMetaB);
    readyCheck();

    const onVis = () => {
      const cur = stateRef.current.active === "A" ? A : B;
      if (document.visibilityState === "hidden") {
        try {
          A.pause();
          B.pause();
        } catch {
          /* ignore */
        }
      } else {
        playSafe(cur);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      A.removeEventListener("loadedmetadata", onMetaA);
      B.removeEventListener("loadedmetadata", onMetaB);
      document.removeEventListener("visibilitychange", onVis);
      if (rafId) window.cancelAnimationFrame(rafId);
      A.style.transition = "";
      B.style.transition = "";
    };
  }, [useLightMode, desktopUrl]);

  // mobil/low‑power: görünürse çal
  useEffect(() => {
    if (!useLightMode || !lightRef.current) return;

    const v = lightRef.current;
    v.preload = disableBgVideo ? "none" : "metadata";
    v.muted = true;
    v.playsInline = true;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !disableBgVideo) {
            v.play().catch(() => {
              /* autoplay engellenebilir */
            });
          } else {
            try {
              v.pause();
            } catch {
              /* ignore */
            }
          }
        }
      },
      { threshold: 0.15 }
    );

    io.observe(v);
    return () => io.disconnect();
  }, [useLightMode, disableBgVideo]);

  return (
    <div
      className={`fixed inset-0 w-full h-full -z-10 overflow-hidden ${className}`}
    >
      {useLightMode ? (
        disableBgVideo ? (
          <img
            src={posterUrl || "/fallback-hero.jpg"}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={lightRef}
            src={mobileUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterUrl || undefined}
          />
        )
      ) : (
        <>
          <video
            ref={vA}
            src={desktopUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={posterUrl || undefined}
          />
          <video
            ref={vB}
            src={desktopUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
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
  mobilePublicId: PropTypes.string,
  posterPublicId: PropTypes.string,
  className: PropTypes.string,
};

BackgroundVideo.defaultProps = {
  mobilePublicId: "",
  posterPublicId: "",
  className: "",
};
