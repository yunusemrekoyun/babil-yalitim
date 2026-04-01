// frontend/src/components/Brands/BrandGrid.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import BrandItem from "./BrandItem";
import useViewportActivation from "../../hooks/useViewportActivation";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

import brandKoster from "../../assets/brand-koster.png";
import brandSika from "../../assets/brand-sika.png";
import brandOde from "../../assets/brand-ode.png";
import brandGeoplas from "../../assets/brand-geoplas.png";
import brandHuntsman from "../../assets/brand-huntsman.png";
import brandMonokim from "../../assets/brand-monokim.png";

const brands = [
  { id: 1, name: "Koster", img: brandKoster, link: "https://www.kostermarket.com/" },
  { id: 2, name: "Sika", img: brandSika, link: "https://tur.sika.com/" },
  { id: 3, name: "ODE", img: brandOde, link: "https://ode.com.tr" },
  { id: 4, name: "Geoplas", img: brandGeoplas, link: "https://www.geoplas.com.tr/en" },
  { id: 5, name: "Huntsman", img: brandHuntsman, link: "https://huntsman.com" },
  { id: 6, name: "Monokim", img: brandMonokim, link: "https://monokim.com" },
];

const MOBILE_LOOP_COPIES = 3;

const BrandGrid = () => {
  const [ref, inView] = useViewportActivation({
    once: false,
    rootMargin: "120px 0px",
  });
  const { allowMarquee, isMobile, tier } = usePerformanceProfile();
  const mobileScrollRef = useRef(null);
  const autoScrollRef = useRef(0);
  const resumeTimerRef = useRef(0);
  const [mobilePaused, setMobilePaused] = useState(false);
  const fullList = useMemo(
    () => [...brands, ...brands, ...brands],
    []
  );

  useEffect(() => {
    if (!isMobile) return undefined;

    const el = mobileScrollRef.current;
    if (!el) return undefined;

    const segmentWidth = el.scrollWidth / MOBILE_LOOP_COPIES;
    if (segmentWidth > 0 && el.scrollLeft === 0) {
      el.scrollLeft = segmentWidth;
    }

    return undefined;
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return undefined;

    const el = mobileScrollRef.current;
    if (!el) return undefined;

    const speed =
      tier === "low" ? 0.28 : tier === "standard" ? 0.44 : 0.58;

    const step = () => {
      autoScrollRef.current = window.requestAnimationFrame(step);

      if (!allowMarquee || !inView || mobilePaused) return;

      const segmentWidth = el.scrollWidth / MOBILE_LOOP_COPIES;
      if (!segmentWidth) return;

      if (el.scrollLeft >= segmentWidth * 2 - 2) {
        el.scrollLeft -= segmentWidth;
      } else if (el.scrollLeft <= 1) {
        el.scrollLeft += segmentWidth;
      }

      el.scrollLeft += speed;
    };

    autoScrollRef.current = window.requestAnimationFrame(step);

    return () => {
      if (autoScrollRef.current) {
        window.cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [allowMarquee, inView, isMobile, mobilePaused, tier]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
      if (autoScrollRef.current) {
        window.cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, []);

  const normalizeMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;

    const segmentWidth = el.scrollWidth / MOBILE_LOOP_COPIES;
    if (!segmentWidth) return;

    if (el.scrollLeft >= segmentWidth * 2) {
      el.scrollLeft -= segmentWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += segmentWidth;
    }
  };

  const pauseMobile = () => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = 0;
    }
    setMobilePaused(true);
  };

  const resumeMobileSoon = () => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setMobilePaused(false);
      resumeTimerRef.current = 0;
    }, 850);
  };

  if (isMobile) {
    return (
      <div ref={ref} id="brands" className="relative mt-2 w-full overflow-hidden">
        <div
          ref={mobileScrollRef}
          className="no-scrollbar overflow-x-auto overscroll-x-contain"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          onScroll={normalizeMobileScroll}
          onTouchStart={pauseMobile}
          onTouchMove={pauseMobile}
          onTouchEnd={resumeMobileSoon}
          onTouchCancel={resumeMobileSoon}
          onPointerDown={pauseMobile}
          onPointerUp={resumeMobileSoon}
          onPointerCancel={resumeMobileSoon}
        >
          <div className="flex w-max items-center py-1">
            {fullList.map((brand, index) => (
              <div key={`${brand.id}-${index}`} className="mx-2.5 shrink-0">
                <BrandItem brand={brand} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id="brands"
      className="relative mt-2 w-full overflow-hidden sm:mt-5"
    >
      <div
        className={`flex whitespace-nowrap animate-brand-marquee ${
          allowMarquee && inView ? "" : "motion-paused"
        }`}
      >
        {fullList.map((brand, index) => (
          <div key={`${brand.id}-${index}`} className="mx-3 sm:mx-8">
            <BrandItem brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandGrid;
