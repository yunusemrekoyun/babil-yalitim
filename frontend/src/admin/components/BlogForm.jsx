// src/admin/components/BlogForm.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const inputCls =
  "w-full rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

function BlogForm({
  initialData,
  onSubmit,
  onStartSubmit,
  submitting = false, // 🔹 BURADA PROPTAN ALIYORUZ
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState((initialData?.tags || []).join(", "));
  const [coverFile, setCoverFile] = useState(null);
  const [assetsFiles, setAssetsFiles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setTags((initialData.tags || []).join(", "));
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setCoverFile(file || null);
  };

  const handleAssetsChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAssetsFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Eğer zaten submitting true ise ikinci kez tetiklenmesini engelle
    if (submitting) return;

    // Parent’a "başladı" sinyali ver → modal hemen kapansın
    if (typeof onStartSubmit === "function") {
      try {
        onStartSubmit();
      } catch {
        //ignore
      }
    }

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("content", content);
    fd.append("tags", tags.trim());

    if (coverFile) fd.append("cover", coverFile);
    if (assetsFiles?.length) {
      assetsFiles.forEach((f) => fd.append("assets", f));
    }

    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
          placeholder="Blog başlığı"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          İçerik
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`min-h-[160px] ${inputCls}`}
          placeholder="İçeriği yazın…"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Etiketler (opsiyonel)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputCls}
          placeholder="Orn. Yalitim, Cati, Izolasyon"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bos birakirsan etiketler icerikten otomatik turetilir.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Kapak {initialData?.cover?.url ? "(guncellemek icin yeni dosya sec)" : "(zorunlu)"}
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          required={!initialData?.cover?.url}
          className="text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
        />
        {initialData?.cover?.url && (
          <div className="text-xs text-slate-500 dark:text-slate-300">
            Mevcut: {initialData.cover.url}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Ek Medya (opsiyonel)
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleAssetsChange}
          className="text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-admin-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "İşleniyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}

BlogForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.shape({
      url: PropTypes.string,
      publicId: PropTypes.string,
      resourceType: PropTypes.oneOf(["image", "video"]),
    }),
    assets: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        publicId: PropTypes.string,
        resourceType: PropTypes.oneOf(["image", "video"]),
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  onStartSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default BlogForm;
