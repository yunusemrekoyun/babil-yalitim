import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EVENT = "admin:progress";

const makeId = () =>
  (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)
    .replace(/-/g, "")
    .slice(0, 12);

export const createProgressTask = (label = "İşlem") => {
  const id = makeId();
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EVENT, {
        detail: { id, label, progress: 0, status: "active" },
      })
    );
  }
  return id;
};

export const updateProgressTask = (id, progress, message) => {
  if (!id || typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: { id, progress, message, status: "active" },
    })
  );
};

export const completeProgressTask = (id, message) => {
  if (!id || typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: { id, progress: 100, status: "done", message },
    })
  );
};

export const failProgressTask = (id, message) => {
  if (!id || typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(EVENT, {
      detail: { id, status: "error", message },
    })
  );
};

const statusStyles = {
  active:
    "from-sky-200/80 via-white to-white text-slate-900 border-sky-200 shadow-sky-200/60",
  done:
    "from-emerald-100 via-white to-white text-emerald-900 border-emerald-200 shadow-emerald-200/60",
  error:
    "from-rose-100 via-white to-white text-rose-900 border-rose-200 shadow-rose-200/60",
};

const ProgressCenter = () => {
  const [tasks, setTasks] = useState([]);
  const timers = useRef({});

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail || {};
      const { id, label, progress, status, message } = detail;
      if (!id) return;
      setTasks((prev) => {
        const existing = prev.find((t) => t.id === id);
        if (!existing) {
          return [
            {
              id,
              label: label || "İşlem",
              progress: typeof progress === "number" ? progress : 0,
              status: status || "active",
              message: message || "",
              createdAt: Date.now(),
            },
            ...prev,
          ];
        }

        return prev.map((t) =>
          t.id === id
            ? {
                ...t,
                label: label || t.label,
                message: message ?? t.message,
                status: status || t.status,
                progress:
                  typeof progress === "number"
                    ? Math.min(100, Math.max(0, progress))
                    : t.progress,
              }
            : t
        );
      });
    };

    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  // Otomatik temizle: done/error 5 sn sonra düşsün
  useEffect(() => {
    tasks.forEach((t) => {
      if (t.status === "active" || timers.current[t.id]) return;
      timers.current[t.id] = setTimeout(() => {
        setTasks((prev) => prev.filter((x) => x.id !== t.id));
        clearTimeout(timers.current[t.id]);
        delete timers.current[t.id];
      }, 5000);
    });
    return () => {
      Object.values(timers.current || {}).forEach(clearTimeout);
      timers.current = {};
    };
  }, [tasks]);

  const sorted = useMemo(
    () =>
      [...tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5), // en fazla 5 öğe göster
    [tasks]
  );

  if (!sorted.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[320px] max-w-[calc(100vw-1.5rem)]">
      <AnimatePresence initial={false}>
        {sorted.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 rounded-2xl border backdrop-blur-2xl bg-gradient-to-br ${
              statusStyles[task.status] || statusStyles.active
            } shadow-xl`}
          >
            <div className="flex items-start gap-2 px-4 py-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-slate-600 shadow shadow-slate-200" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight text-slate-900">
                    {task.label}
                  </p>
                  <span className="text-xs font-medium text-slate-700">
                    {Math.round(task.progress)}%
                  </span>
                </div>
                {task.message && (
                  <p className="mt-1 text-xs text-slate-700 line-clamp-2">
                    {task.message}
                  </p>
                )}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      task.status === "done"
                        ? "bg-emerald-400"
                        : task.status === "error"
                        ? "bg-rose-400"
                        : "bg-sky-400"
                    }`}
                    style={{ width: `${Math.min(100, task.progress)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProgressCenter;
