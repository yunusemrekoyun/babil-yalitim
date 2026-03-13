import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import RichContentField from "./RichContentField";
import { BlogPreview } from "./previews/ContentPreviews";

const inputCls =
  "w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950/55 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

const fileCls =
  "text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100";

const toMediaType = (fileOrMedia) => {
  if (!fileOrMedia) return "image";
  if (fileOrMedia.resourceType) return fileOrMedia.resourceType;
  if (fileOrMedia.type) return fileOrMedia.type.startsWith("video/") ? "video" : "image";
  return "image";
};

const toTagList = (value = "") =>
  String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

function BlogForm({ initialData, onSubmit, onStartSubmit, submitting = false }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState((initialData?.tags || []).join(", "));
  const [coverFile, setCoverFile] = useState(null);
  const [assetsFiles, setAssetsFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [coverPreview, setCoverPreview] = useState("");
  const [assetPreviews, setAssetPreviews] = useState([]);
  const blobUrlsRef = useRef([]);

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || "");
    setContent(initialData.content || "");
    setTags((initialData.tags || []).join(", "));
  }, [initialData]);

  useEffect(
    () => () => {
      blobUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      blobUrlsRef.current = [];
    },
    []
  );

  const rememberUrl = (file) => {
    if (!file) return "";
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.push(url);
    return url;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCoverFile(file);
    setCoverPreview(file ? rememberUrl(file) : "");
  };

  const handleAssetsChange = (event) => {
    const files = Array.from(event.target.files || []);
    setAssetsFiles(files);
    setAssetPreviews(files.map((file) => rememberUrl(file)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (typeof onStartSubmit === "function") {
      try {
        onStartSubmit();
      } catch {
        /* ignore */
      }
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content);
    formData.append("tags", tags.trim());

    if (coverFile) formData.append("cover", coverFile);
    assetsFiles.forEach((file) => formData.append("assets", file));

    await onSubmit(formData);
  };

  const previewData = useMemo(
    () => ({
      title,
      tags: toTagList(tags),
      content,
      cover: {
        src: coverPreview || initialData?.cover?.url || "",
        type: coverFile ? toMediaType(coverFile) : initialData?.cover?.resourceType || "image",
        alt: title,
      },
      assets: [
        ...(assetPreviews.length
          ? assetPreviews.map((src, index) => ({
              src,
              type: toMediaType(assetsFiles[index]),
              alt: `${title}-asset-${index + 1}`,
            }))
          : (initialData?.assets || []).map((asset) => ({
              src: asset.url,
              type: asset.resourceType || "image",
              alt: `${title}-asset`,
            }))),
      ],
    }),
    [assetPreviews, assetsFiles, content, coverFile, coverPreview, initialData, tags, title]
  );

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputCls}
          placeholder="Blog başlığı"
          required
        />
      </div>

      <RichContentField
        label="İçerik"
        value={content}
        onChange={setContent}
        inputClassName={`min-h-[220px] ${inputCls}`}
        placeholder="İçeriği yazın…"
        rows={11}
        onTogglePreview={() => setShowPreview((prev) => !prev)}
        showPreview={showPreview}
      />

      {showPreview && <BlogPreview preview={previewData} />}

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Etiketler (opsiyonel)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          className={inputCls}
          placeholder="Orn. Yalitim, Cati, Izolasyon"
        />
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Boş bırakırsan etiketler içerikten otomatik türetilir.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Kapak {initialData?.cover?.url ? "(güncellemek için yeni dosya seç)" : "(zorunlu)"}
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          required={!initialData?.cover?.url}
          className={fileCls}
        />
        {initialData?.cover?.url && (
          <div className="admin-preview-surface p-3 text-xs text-slate-500 dark:text-slate-300">
            Mevcut kapak seçili. Yeni dosya yüklersen onunla değiştirilir.
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
          className={fileCls}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-admin-primary disabled:cursor-not-allowed disabled:opacity-60"
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
