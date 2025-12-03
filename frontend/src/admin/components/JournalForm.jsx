// frontend/src/admin/components/JournalForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import ToastAlert from "./ToastAlert";

const inputCls =
  "w-full rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

/* Küçük yardımcı */
const MediaThumb = ({ src, type = "image", className = "" }) => {
  if (!src) return null;
  if (type === "video") {
    return (
      <video
        src={src}
        className={className}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return <img src={src} alt="" className={className} />;
};

MediaThumb.propTypes = {
  src: PropTypes.string,
  type: PropTypes.oneOf(["image", "video"]),
  className: PropTypes.string,
};

const JournalForm = ({ initialData, onSubmit, onRemoveAsset, submitting }) => {
  const isEdit = Boolean(initialData?._id);

  // metin alanları
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");

  // mevcut medya (sadece gösterim)
  const existingCover = useMemo(
    () => initialData?.cover || null,
    [initialData?.cover]
  );
  const existingAssets = useMemo(
    () => initialData?.assets || [],
    [initialData?.assets]
  );

  // yeni seçilen dosyalar
  const [coverFile, setCoverFile] = useState(null);
  const [assetsFiles, setAssetsFiles] = useState([]);

  // önizlemeler
  const [coverPreview, setCoverPreview] = useState(null);
  const [assetsPreviews, setAssetsPreviews] = useState([]);
  const revokers = useRef([]);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    return () => {
      revokers.current.forEach((u) => {
        if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
      });
      revokers.current = [];
    };
  }, []);

  const blobify = (file, setter) => {
    if (!file) return setter(null);
    const u = URL.createObjectURL(file);
    revokers.current.push(u);
    setter(u);
  };

  const handleCoverChange = (e) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    blobify(f, setCoverPreview);
  };

  const handleAssetsChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAssetsFiles(files);
    // eski blobları bırak
    assetsPreviews.forEach(
      (u) => u?.startsWith("blob:") && URL.revokeObjectURL(u)
    );
    const urls = files.map((f) => {
      const u = URL.createObjectURL(f);
      revokers.current.push(u);
      return u;
    });
    setAssetsPreviews(urls);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!isEdit && !coverFile) {
      // alert yerine ortak toast
      showToast("Kapak görseli zorunludur.", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    if (coverFile) fd.append("cover", coverFile);
    assetsFiles.forEach((f) => fd.append("assets", f));

    onSubmit(fd);
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      noValidate
    >
      {/* Sol: metin alanları */}
      <div className="lg:col-span-3 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Başlık *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`mt-2 ${inputCls}`}
            placeholder="Örn: X firması ile anlaşma"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            İçerik *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className={`mt-2 leading-relaxed ${inputCls}`}
            placeholder="Habere dair detaylar…"
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="btn-admin-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "İşleniyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Sağ: medya alanları */}
      <div className="lg:col-span-2 space-y-6">
        {/* Kapak */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kapak Görseli {isEdit ? "(mevcut varsa opsiyonel)" : "(zorunlu)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
          />
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            {coverPreview ? (
              <MediaThumb src={coverPreview} className="w-full" />
            ) : existingCover?.url ? (
              <MediaThumb src={existingCover.url} className="w-full" />
            ) : (
              <div className="aspect-video grid place-items-center text-xs text-slate-400">
                Önizleme
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Kapak için PNG/JPEG/WEBP önerilir.
          </p>
        </div>

        {/* Alt medya (image/video çoklu) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Alt Medya (opsiyonel, çoklu — resim ya da video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleAssetsChange}
            className="mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
          />

          {!!existingAssets.length && (
            <>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Mevcut medya</p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {existingAssets.map((m) => (
                  <div
                    key={m.publicId}
                    className="relative rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
                  >
                    <MediaThumb
                      src={m.url}
                      type={m.resourceType === "video" ? "video" : "image"}
                      className="h-28 w-full object-cover"
                    />
                    {onRemoveAsset && (
                      <button
                        type="button"
                        onClick={() => onRemoveAsset(m.publicId)}
                        className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md shadow-rose-500/30 hover:-translate-y-[1px] transition"
                        aria-label="Medyayı sil"
                        title="Medyayı sil"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!!assetsPreviews.length && (
            <>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Yeni eklenecekler
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {assetsPreviews.map((u, i) => (
                  <MediaThumb
                    key={i}
                    src={u}
                    className="h-28 w-full object-cover rounded-2xl border border-slate-200/70 dark:border-slate-700"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
};

JournalForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
    }),
    assets: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        publicId: PropTypes.string,
        resourceType: PropTypes.string,
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  onRemoveAsset: PropTypes.func, // sadece edit ekranında kullanılıyor (ConfirmModal parent'ta)
  submitting: PropTypes.bool,
};

export default JournalForm;
