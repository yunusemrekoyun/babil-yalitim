// src/admin/pages/project/ProjectList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../../api";

// Ortak uyarı & onay
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";

const Card = ({ project, onDelete }) => {
  const coverIsVideo = project?.cover?.resourceType === "video";
  const coverSrc = project?.cover?.url || "";
  const hasCover = Boolean(coverSrc);

  return (
    <div className="admin-card p-4 relative overflow-hidden">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/60">
        {hasCover ? (
          coverIsVideo ? (
            <video
              src={coverSrc}
              className="h-full w-full object-cover"
              controls={false}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={coverSrc}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="h-full w-full grid place-items-center text-xs text-slate-400">
            Kapak yok
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-slate-900 line-clamp-1 dark:text-white">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mt-1 dark:text-slate-300">
          {project.description}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 dark:text-slate-200">
            {project.category || "Kategori yok"}
          </span>
          <span>
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString("tr-TR")
              : "-"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/admin/projects/edit/${project._id}`}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-amber-500/25"
        >
          Düzenle
        </Link>
        <button
          onClick={() => onDelete(project._id, project.title)}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-500/25"
        >
          Sil
        </button>
      </div>
    </div>
  );
};

Card.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    cover: PropTypes.shape({
      resourceType: PropTypes.oneOf(["image", "video"]),
      url: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired, // (id, title) => void
};

const ProjectList = () => {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputCls =
    "w-full sm:w-64 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

  // filtre durumları
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("-createdAt"); // -createdAt / createdAt / title

  // Toast & Confirm state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const [confirm, setConfirm] = useState(null);
  const askConfirm = (cfg) => setConfirm(cfg);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/projects");
        setAll(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("GET /projects error:", err?.response?.data || err);
        showToast(
          err?.response?.data?.message || "Projeler getirilemedi.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const cats = useMemo(() => {
    const set = new Set();
    all.forEach((p) => p.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [all]);

  const filtered = useMemo(() => {
    let arr = [...all];
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
      );
    }
    if (cat !== "all") arr = arr.filter((p) => p.category === cat);

    if (sort === "-createdAt")
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "createdAt")
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "title")
      arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return arr;
  }, [all, q, cat, sort]);

  const handleDelete = (id, title) => {
    askConfirm({
      title: "Proje silinsin mi?",
      message: `“${
        title || "Adsız Proje"
      }” kalıcı olarak silinecek. Bu işlemi onaylıyor musunuz?`,
      confirmText: "Evet, sil",
      cancelText: "Vazgeç",
      type: "danger",
      onConfirm: async () => {
        try {
          const { data } = await api.delete(`/projects/${id}`);
          setAll((prev) => prev.filter((p) => p._id !== id));
          showToast(data?.message || "Proje silindi.", "success");
        } catch (err) {
          console.error(
            "DELETE /projects/:id error:",
            err?.response?.data || err
          );
          showToast(
            err?.response?.data?.message || "Silme işleminde hata.",
            "error"
          );
        }
      },
      onCancel: () => {},
    });
  };

  if (loading) return <div className="p-4 text-slate-500">Yükleniyor…</div>;

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="admin-section p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge-soft">Projeler</span>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Projeler
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Kartlar ve filtreler koyu/açık moda göre yeniden tasarlandı.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara (başlık/açıklama)"
              className={`${inputCls} sm:w-64`}
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className={`${inputCls} sm:w-40`}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "Tüm Kategoriler" : c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={`${inputCls} sm:w-44`}
            >
              <option value="-createdAt">Yeniden → Eskiye</option>
              <option value="createdAt">Eskiden → Yeniye</option>
              <option value="title">Başlığa göre</option>
            </select>
            <Link to="/admin/projects/add" className="btn-admin-primary shrink-0">
              Yeni Proje
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p._id} project={p} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full admin-card p-6 text-center text-slate-500 dark:text-slate-300">
            Kayıt bulunamadı.
          </div>
        )}
      </div>

      {/* Onay & Uyarı */}
      {confirm && (
        <ConfirmDialog
          open={true}
          title={confirm.title}
          message={confirm.message}
          confirmText={confirm.confirmText || "Onayla"}
          cancelText={confirm.cancelText || "Vazgeç"}
          type={confirm.type}
          loading={confirm.loading}
          onClose={() => setConfirm(null)}
          onConfirm={async () => {
            if (confirm.loading) return;
            setConfirm((c) => ({ ...c, loading: true }));
            const fn = confirm.onConfirm;
            await fn?.();
            setConfirm(null);
          }}
          onCancel={() => {
            if (confirm.loading) return;
            confirm.onCancel?.();
            setConfirm(null);
          }}
        />
      )}
      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;
