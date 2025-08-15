import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

/**
 * Basit toast bileşeni
 *
 * Props:
 * msg       : string              → Gösterilecek metin
 * type      : "success" | "error" | "info" (default "info")
 * duration  : ms                  → Otomatik kapanma süresi (default 4000)
 * onClose   : () => void          → Kapatma işlemi
 */
export default function ToastAlert({
  msg,
  type = "info",
  duration = 4000,
  onClose,
}) {
  // Otomatik kapanma
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  // Tip bazlı stil ve ikon
  const styleMap = {
    success: {
      bg: "bg-quaternaryColor", // sitenin başarı rengi
      icon: <FaCheckCircle className="mr-2" />,
    },
    error: {
      bg: "bg-red-600",
      icon: <FaExclamationCircle className="mr-2" />,
    },
    info: {
      bg: "bg-secondaryColor",
      icon: <FaInfoCircle className="mr-2" />,
    },
  };

  const { bg, icon } = styleMap[type] ?? styleMap.info;

  return createPortal(
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div
        className={`${bg} text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-slide-down`}
      >
        {icon}
        <span className="text-sm font-medium">{msg}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white/80 hover:text-white transition text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
}
