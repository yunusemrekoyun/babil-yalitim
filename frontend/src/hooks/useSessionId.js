// src/hooks/useSessionId.js
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const KEY = "sessionId";

export default function useSessionId(consent) {
  const ref = useRef(null);

  useEffect(() => {
    // Sadece consent === "true" iken session oluştur/sürdür
    if (consent !== "true") {
      ref.current = null;
      return;
    }
    try {
      let sid = localStorage.getItem(KEY);
      if (!sid) {
        sid = uuidv4();
        localStorage.setItem(KEY, sid);
      }
      ref.current = sid;
    } catch {
      ref.current = null;
    }
  }, [consent]);

  return ref.current; // null veya string
}
