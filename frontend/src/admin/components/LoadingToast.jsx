import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

/**
 * Basit mini loader UI (sağ altta).
 * Bunu hem bağımsız component olarak kullanabileceğin gibi,
 * alttaki mountGlobalLoadingToast ile global olarak body'ye mount edip
 * "app:loading-toast" eventiyle kontrol edebilirsin.
 */
const LoadingToast = ({ visible = false, text = "Kaydediliyor…" }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-lg"
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
        aria-hidden
      />
      <span>{text}</span>
    </div>
  );
};

export default LoadingToast;

/**
 * GLOBAL LOADER MONTAJI (YENİ DOSYA YOK)
 * Bu fonksiyon çağrıldığında body'ye görünmez bir root ekler ve
 * "app:loading-toast" event'ini dinleyen global bir LoadingToast render eder.
 *
 * Güvenli: Birden çok kez çağrılsa da bir defa mount eder.
 */
let __globalToastMounted = false;
export function mountGlobalLoadingToast() {
  if (typeof window === "undefined" || __globalToastMounted) return;
  const ROOT_ID = "global-loading-toast-root";

  let host = document.getElementById(ROOT_ID);
  if (!host) {
    host = document.createElement("div");
    host.id = ROOT_ID;
    document.body.appendChild(host);
  }

  const root = ReactDOM.createRoot(host);

  const GlobalToast = () => {
    const [state, setState] = useState({ visible: false, text: "Kaydediliyor…" });

    useEffect(() => {
      const handler = (e) => {
        const { visible, text } = e.detail || {};
        setState((prev) => ({
          visible: typeof visible === "boolean" ? visible : prev.visible,
          text: text ?? prev.text,
        }));
      };
      window.addEventListener("app:loading-toast", handler);
      return () => window.removeEventListener("app:loading-toast", handler);
    }, []);

    return <LoadingToast visible={state.visible} text={state.text} />;
  };

  root.render(<GlobalToast />);
  __globalToastMounted = true;
}

/** Küçük yardımcılar: event yolla → global loader aç/kapat */
export const showGlobalLoading = (text = "Kaydediliyor…") =>
  window.dispatchEvent(
    new CustomEvent("app:loading-toast", { detail: { visible: true, text } })
  );

export const hideGlobalLoading = () =>
  window.dispatchEvent(new CustomEvent("app:loading-toast", { detail: { visible: false } }));