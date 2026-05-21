// frontend/src/components/Brands/BrandGrid.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BrandItem from "./BrandItem";
import useViewportActivation from "../../hooks/useViewportActivation";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

import brandKoster from "../../assets/brand-koster.png";
import brandSika from "../../assets/brand-sika.png";
import brandOde from "../../assets/brand-ode.png";
import brandHuntsman from "../../assets/brand-huntsman.png";
import brandAbSchomburg from "../../assets/brand-AB-Schomburg.png";
import brandOnduline from "../../assets/brand-onduline.svg";
import brandNaturelMuhendislik from "../../assets/brand-naturelmuhendislik.png";
import brandPhurex from "../../assets/brand-phurex.png";
import brandTekno from "../../assets/brand-tekno.png";

const brands = [
  { id: 1, name: "Koster", img: brandKoster, link: "https://www.kostermarket.com/" },
  { id: 2, name: "Sika", img: brandSika, link: "https://tur.sika.com/" },
  { id: 3, name: "ODE", img: brandOde, link: "https://ode.com.tr" },
  { id: 4, name: "Phurex", img: brandPhurex, link: "https://phurex.com/" },
  { id: 5, name: "Huntsman", img: brandHuntsman, link: "https://huntsman.com" },
  {
    id: 6,
    name: "AB Schomburg",
    img: brandAbSchomburg,
    link: "https://ab-schomburg.com.tr/",
  },
  {
    id: 7,
    name: "Onduline Avrasya",
    img: brandOnduline,
    link: "https://tr.onduline.com/",
  },
  {
    id: 8,
    name: "Natürel Mühendislik",
    img: brandNaturelMuhendislik,
    link: "https://www.naturelmuhendislik.com.tr/",
  },
  {
    id: 9,
    name: "Tekno Yapı Kimyasalları",
    img: brandTekno,
    link: "https://teknoyapi.com.tr/",
  },
];

const LOOP_COPIES = 3;
const RESUME_DELAY_MS = 1000;

const BrandGrid = () => {
  const [ref, inView] = useViewportActivation({
    once: false,
    rootMargin: "120px 0px",
  });
  const { allowMarquee, isMobile, tier } = usePerformanceProfile();
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(0);
  const resumeTimerRef = useRef(0);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    pointerId: null,
  });
  const suppressClickRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const fullList = useMemo(
    () => [...brands, ...brands, ...brands],
    []
  );
  const autoScrollSpeed =
    tier === "low"
      ? isMobile
        ? 0.32
        : 0.42
      : tier === "standard"
        ? isMobile
          ? 0.5
          : 0.64
        : isMobile
          ? 0.66
          : 0.8;

  const normalizeScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const segmentWidth = el.scrollWidth / LOOP_COPIES;
    if (!segmentWidth) return;

    if (el.scrollLeft >= segmentWidth * 2) {
      el.scrollLeft -= segmentWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += segmentWidth;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const segmentWidth = el.scrollWidth / LOOP_COPIES;
    if (segmentWidth > 0 && el.scrollLeft === 0) {
      el.scrollLeft = segmentWidth;
    }

    const syncPosition = () => {
      const nextSegmentWidth = el.scrollWidth / LOOP_COPIES;
      if (!nextSegmentWidth) return;
      if (el.scrollLeft === 0) {
        el.scrollLeft = nextSegmentWidth;
        return;
      }
      normalizeScrollPosition();
    };

    window.addEventListener("resize", syncPosition);
    return () => {
      window.removeEventListener("resize", syncPosition);
    };
  }, [normalizeScrollPosition]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const step = () => {
      autoScrollRef.current = window.requestAnimationFrame(step);

      if (
        !allowMarquee ||
        !inView ||
        isPaused ||
        dragStateRef.current.isDragging
      ) {
        return;
      }

      normalizeScrollPosition();
      el.scrollLeft += autoScrollSpeed;
      normalizeScrollPosition();
    };

    autoScrollRef.current = window.requestAnimationFrame(step);

    return () => {
      if (autoScrollRef.current) {
        window.cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [allowMarquee, autoScrollSpeed, inView, isPaused, normalizeScrollPosition]);

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

  const pauseAutoplay = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = 0;
    }
    setIsPaused(true);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = 0;
    }, RESUME_DELAY_MS);
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const el = scrollRef.current;
    if (!el) return;

    pauseAutoplay();
    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
      pointerId: event.pointerId,
    };

    el.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const el = scrollRef.current;
    const dragState = dragStateRef.current;
    if (!el || !dragState.isDragging) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 6) {
      dragState.moved = true;
    }

    el.scrollLeft = dragState.startScrollLeft - deltaX;
    normalizeScrollPosition();
  };

  const finishDrag = () => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging) return;

    if (dragState.moved) {
      suppressClickRef.current = true;
    }

    dragStateRef.current = {
      isDragging: false,
      startX: 0,
      startScrollLeft: 0,
      moved: false,
      pointerId: null,
    };

    scheduleResume();
  };

  const handlePointerUp = () => {
    const el = scrollRef.current;
    if (el && dragStateRef.current.pointerId !== null) {
      el.releasePointerCapture?.(dragStateRef.current.pointerId);
    }
    finishDrag();
  };

  const handleClickCapture = (event) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      ref={ref}
      id="brands"
      className="relative mt-2 w-full overflow-hidden sm:mt-5"
    >
      <div
        ref={scrollRef}
        className={`no-scrollbar overflow-x-auto overscroll-x-contain select-none ${
          isMobile ? "" : "cursor-grab active:cursor-grabbing"
        }`}
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
        onScroll={normalizeScrollPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClickCapture={handleClickCapture}
      >
        <div className="flex w-max items-center py-1">
          {fullList.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className={isMobile ? "mx-2.5 shrink-0" : "mx-3 shrink-0 sm:mx-8"}
            >
              <BrandItem brand={brand} disableLink={isMobile} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandGrid;
