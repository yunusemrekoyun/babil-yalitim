import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import ToastAlert from "./ToastAlert";
import RichContentField from "./RichContentField";
import { JournalPreview } from "./previews/ContentPreviews";
import OrderField from "./OrderField";

const inputCls =
  "w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950/55 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

const fileCls =
  "mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100";

const toMediaType = (fileOrMedia) => {
  if (!fileOrMedia) return "image";
  if (fileOrMedia.resourceType) return fileOrMedia.resourceType;
  if (fileOrMedia.type) return fileOrMedia.type.startsWith("video/") ? "video" : "image";
  return "image";
};

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

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder ? String(initialData.displayOrder) : ""
  );
  const [showPreview, setShowPreview] = useState(false);

  const existingCover = useMemo(
    () => initialData?.cover || null,
    [initialData?.cover]
  );
  const existingAssets = useMemo(
    () => initialData?.assets || [],
    [initialData?.assets]
  );

  const [coverFile, setCoverFile] = useState(null);
  const [assetsFiles, setAssetsFiles] = useState([]);

  const [coverPreview, setCoverPreview] = useState(null);
  const [assetsPreviews, setAssetsPreviews] = useState([]);
  const revokers = useRef([]);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || "");
    setContent(initialData.content || "");
    setDisplayOrder(
      initialData.displayOrder ? String(initialData.displayOrder) : ""
    );
  }, [initialData]);

  useEffect(() => {
    return () => {
      revokers.current.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      revokers.current = [];
    };
  }, []);

  const blobify = (file, setter) => {
    if (!file) return setter(null);
    const url = URL.createObjectURL(file);
    revokers.current.push(url);
    setter(url);
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0] || null;
    setCoverFile(file);
    blobify(file, setCoverPreview);
  };

  const handleAssetsChange = (event) => {
    const files = Array.from(event.target.files || []);
    setAssetsFiles(files);
    assetsPreviews.forEach((url) => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    const urls = files.map((file) => {
      const url = URL.createObjectURL(file);
      revokers.current.push(url);
      return url;
    });
    setAssetsPreviews(urls);
  };

  const submit = (event) => {
    event.preventDefault();

    if (!isEdit && !coverFile) {
      showToast("Kapak görseli zorunludur.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (displayOrder.trim()) formData.append("displayOrder", displayOrder.trim());
    if (coverFile) formData.append("cover", coverFile);
    assetsFiles.forEach((file) => formData.append("assets", file));

    onSubmit(formData);
  };

  const previewData = useMemo(
    () => ({
      title,
      content,
      cover: {
        src: coverPreview || existingCover?.url || "",
        type: coverFile ? toMediaType(coverFile) : existingCover?.resourceType || "image",
        alt: title,
      },
      assets: assetsPreviews.length
        ? assetsPreviews.map((src, index) => ({
            src,
            type: toMediaType(assetsFiles[index]),
            alt: `${title}-asset-${index + 1}`,
          }))
        : existingAssets.map((asset) => ({
            src: asset.url,
            type: asset.resourceType || "image",
            alt: `${title}-asset`,
          })),
    }),
    [assetsFiles, assetsPreviews, content, coverFile, coverPreview, existingAssets, existingCover, title]
  );

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      noValidate
    >
      <div className="space-y-5 lg:col-span-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Başlık *
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className={`mt-2 ${inputCls}`}
            placeholder="Örn: X firması ile anlaşma"
          />
        </div>

        <OrderField value={displayOrder} onChange={setDisplayOrder} />

        <RichContentField
          label="İçerik *"
          value={content}
          onChange={setContent}
          rows={10}
          inputClassName={`min-h-[220px] ${inputCls}`}
          placeholder="Habere dair detaylar…"
          onTogglePreview={() => setShowPreview((prev) => !prev)}
          showPreview={showPreview}
        />

        {showPreview && <JournalPreview preview={previewData} />}

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="btn-admin-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "İşleniyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kapak Görseli {isEdit ? "(mevcut varsa opsiyonel)" : "(zorunlu)"}
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleCoverChange}
            className={fileCls}
          />
          <div className="admin-preview-surface mt-3 overflow-hidden">
            {coverPreview ? (
              <MediaThumb
                src={coverPreview}
                type={toMediaType(coverFile)}
                className="w-full"
              />
            ) : existingCover?.url ? (
              <MediaThumb
                src={existingCover.url}
                type={existingCover.resourceType || "image"}
                className="w-full"
              />
            ) : (
              <div className="grid aspect-video place-items-center text-xs text-slate-400 dark:text-slate-500">
                Önizleme
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Alt Medya (opsiyonel, çoklu — resim ya da video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleAssetsChange}
            className={fileCls}
          />

          {!!existingAssets.length && (
            <>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                Mevcut medya
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {existingAssets.map((asset) => (
                  <div
                    key={asset.publicId}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
                  >
                    <MediaThumb
                      src={asset.url}
                      type={asset.resourceType === "video" ? "video" : "image"}
                      className="h-28 w-full object-cover"
                    />
                    {onRemoveAsset && (
                      <button
                        type="button"
                        onClick={() => onRemoveAsset(asset.publicId)}
                        className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md shadow-rose-500/30 transition hover:-translate-y-[1px]"
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
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-300">
                Yeni eklenecekler
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {assetsPreviews.map((url, index) => (
                  <MediaThumb
                    key={url}
                    src={url}
                    type={toMediaType(assetsFiles[index])}
                    className="h-28 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
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
    displayOrder: PropTypes.number,
    cover: PropTypes.shape({
      url: PropTypes.string,
      resourceType: PropTypes.string,
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
  onRemoveAsset: PropTypes.func,
  submitting: PropTypes.bool,
};

export default JournalForm;
