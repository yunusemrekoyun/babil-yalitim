// src/hooks/useAnalytics.js
import { useEffect } from "react";
import api from "../api";

export default function useAnalytics(path, section) {
  useEffect(() => {
    if (localStorage.getItem("analytics_consent") !== "true") return;

    const sessionId =
      localStorage.getItem("session_id") ||
      (localStorage.setItem("session_id", crypto.randomUUID()),
      localStorage.getItem("session_id"));

    const startTime = Date.now();
    let maxScroll = 0;

    const onScroll = () => {
      const scrolled =
        (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      maxScroll = Math.max(maxScroll, Math.round(scrolled * 100));
    };

    window.addEventListener("scroll", onScroll);

    const sendVisit = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      api.post(
        "/visits",
        { path, duration, scrollDepth: maxScroll, section },
        { headers: { "x-session-id": sessionId } }
      );
    };

    window.addEventListener("beforeunload", sendVisit);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", sendVisit);
      sendVisit();
    };
  }, [path, section]);
}
