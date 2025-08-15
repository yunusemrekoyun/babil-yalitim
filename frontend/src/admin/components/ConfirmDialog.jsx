import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

/**
 * Basit, site stiline uygun onay diyaloğu
 *
 * Props:
 * open: boolean
 * title?: string
 * message: string | ReactNode
 * confirmText?: string (default: "Evet")
 * cancelText?: string (default: "Vazgeç")
 * onConfirm: () => void
 * onCancel: () => void
 * type?: "danger" | "info" | "success"  (buton rengi için)
 */
export default function ConfirmDialog({
  open,
  title = "Onay",
  message,
  confirmText = "Evet",
  cancelText = "Vazgeç",
  onConfirm,
  onCancel,
  type = "danger",
}) {
  // ESC kapatma
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const colorMap = {
    danger: "bg-red-600 hover:bg-red-700",
    info: "bg-sky-600 hover:bg-sky-700",
    success: "bg-emerald-600 hover:bg-emerald-700",
  };
  const confirmBtn = colorMap[type] || colorMap.info;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* modal */}
      <div className="relative z-10 w-[92vw] max-w-md rounded-2xl border border-white/30 bg-white/90 backdrop-blur-xl shadow-xl p-5">
        <h3 className="text-lg font-semibold text-brandDark">{title}</h3>
        <div className="mt-2 text-sm text-gray-700">{message}</div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm text-white ${confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["danger", "info", "success"]),
};
