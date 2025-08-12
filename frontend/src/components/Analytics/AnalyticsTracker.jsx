// src/components/Analytics/AnalyticsTracker.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api";
import useConsent from "../../hooks/useConsent";
import useSessionId from "../../hooks/useSessionId";

/**
 * Bu bileşen Router içinde bir kez render edilir.
 * - Admin rotalarını hariç tutar.
 * - Her route değişiminde süre ve scrollDepth toplayıp /visits'e POST eder.
 */
const AnalyticsTracker = () => {
  const { pathname } = useLocation();
  const { consent } = useConsent();
  const sessionId = useSessionId(consent);

  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const lastPathRef = useRef(pathname);

  // Admin rotalarını tamamen ignore et
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    // Scroll takibi
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const depth =
        docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      if (depth > maxScrollRef.current) maxScrollRef.current = depth;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  // Route değişimlerinde kayıt gönder
  useEffect(() => {
    if (isAdmin) {
      // Admin sayfasında geziyorsa önceki public sayfanın kaydını flush et
      startTimeRef.current = Date.now();
      maxScrollRef.current = 0;
      lastPathRef.current = pathname;
      return;
    }

    const now = Date.now();
    const prevPath = lastPathRef.current;
    const durationSec = Math.round((now - startTimeRef.current) / 1000);

    // Önceki public sayfa için kayıt gönder (ilk girişte prevPath===currPath olabilir)
    if (prevPath && consent === "true") {
      api
        .post(
          "/visits",
          {
            path: prevPath,
            duration: durationSec,
            scrollDepth: maxScrollRef.current,
            // section göndermesek de controller guessSection ile atıyor
          },
          {
            headers: {
              "x-analytics-consent": "true",
              ...(sessionId ? { "x-session-id": sessionId } : {}),
            },
          }
        )
        .catch(() => {});
    }

    // Yeni sayfa için sayaçları sıfırla
    startTimeRef.current = now;
    maxScrollRef.current = 0;
    lastPathRef.current = pathname;
  }, [pathname, consent, sessionId, isAdmin]);

  // Sayfadan ayrılırken (tab kapatma / reload) son sayfayı gönder
  useEffect(() => {
    if (isAdmin) return;
    const beforeUnload = () => {
      if (consent !== "true") return;
      const now = Date.now();
      const durationSec = Math.round((now - startTimeRef.current) / 1000);
      const path = lastPathRef.current || window.location.pathname;

      navigator.sendBeacon?.(
        `${import.meta.env.VITE_API_BASE_URL}/visits`,
        new Blob(
          [
            JSON.stringify({
              path,
              duration: durationSec,
              scrollDepth: maxScrollRef.current,
            }),
          ],
          { type: "application/json" }
        )
      );
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [consent, isAdmin]);

  return null;
};

export default AnalyticsTracker;
