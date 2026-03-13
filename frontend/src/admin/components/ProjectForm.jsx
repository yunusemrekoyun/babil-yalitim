// src/admin/components/ProjectForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import ToastAlert from "./ToastAlert";
import { ProjectPreview } from "./previews/ContentPreviews";

const inputCls =
  "w-full rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

/** MediaPreview: seçilen dosyayı veya mevcut URL’yi gösterir */
const MediaPreview = ({ src, type = "image", className = "" }) => {
  if (!src) return null;
  return type === "video" ? (
    <video src={src} className={className} controls playsInline muted />
  ) : (
    <img src={src} className={className} alt="" />
  );
};

MediaPreview.propTypes = {
  src: PropTypes.string,
  type: PropTypes.oneOf(["image", "video"]),
  className: PropTypes.string,
};

const ProjectForm = ({ initialData, onSubmit, submitting }) => {
  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });
  const [showPreview, setShowPreview] = useState(false);

  // text alanları
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState(initialData?.category || "");

  // yeni eklenen tarih alanları (opsiyonel)
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");

  // mevcut medya
  const existingCover = useMemo(
    () => initialData?.cover || null,
    [initialData?.cover]
  );
  const existingVideo = useMemo(
    () => initialData?.video || null,
    [initialData?.video]
  );
  const existingImages = useMemo(
    () => initialData?.images || [],
    [initialData?.images]
  );

  // yeni seçilen dosyalar
  const [coverFile, setCoverFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);

  // önizlemeler
  const [coverPreview, setCoverPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const revokers = useRef([]);

  // toplam görsel adedi (max 4)
  const remainingImageSlots = useMemo(
    () => Math.max(0, 4 - (existingImages.length || 0)),
    [existingImages]
  );

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

  const handleVideoChange = (e) => {
    const f = e.target.files?.[0] || null;
    setVideoFile(f);
    blobify(f, setVideoPreview);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > remainingImageSlots) {
      showToast(
        `En fazla ${remainingImageSlots} görsel daha eklenebilir.`,
        "info"
      );
    }
    const limited = files.slice(0, remainingImageSlots);
    setImagesFiles(limited);

    const urls = limited.map((f) => {
      const u = URL.createObjectURL(f);
      revokers.current.push(u);
      return u;
    });
    setImagesPreviews(urls);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!existingCover && !coverFile) {
      showToast("Kapak medyası zorunludur (görsel ya da video).", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("category", category);

    // tarih alanları opsiyonel
    if (startDate) fd.append("startDate", startDate);
    if (endDate) fd.append("endDate", endDate);

    if (coverFile) fd.append("cover", coverFile);
    if (videoFile) fd.append("video", videoFile);
    imagesFiles.forEach((f) => fd.append("images", f));

    // İstersen debug kalsın; prod'da silebilirsin
    // for (const [k, v] of fd.entries()) {
    //   console.log(
    //     k,
    //     v instanceof File ? { name: v.name, type: v.type, size: v.size } : v
    //   );
    // }
    onSubmit(fd);
  };

  const existingCoverType = existingCover?.resourceType || "image";
  const newCoverType = coverFile?.type?.startsWith("video") ? "video" : "image";

  const previewData = useMemo(
    () => ({
      title,
      description,
      category,
      startDate: startDate ? startDate.split("T")[0] : "",
      endDate: endDate ? endDate.split("T")[0] : "",
      cover: {
        src: coverPreview || existingCover?.url || "",
        type: coverFile ? newCoverType : existingCoverType,
        alt: title,
      },
      video: {
        src: videoPreview || existingVideo?.url || "",
        type: "video",
        alt: `${title}-video`,
      },
      images: imagesPreviews.length
        ? imagesPreviews.map((src) => ({
            src,
            type: "image",
            alt: `${title}-gorsel`,
          }))
        : existingImages.map((img) => ({
            src: img.url,
            type: img.resourceType || "image",
            alt: `${title}-gorsel`,
          })),
    }),
    [
      category,
      coverPreview,
      description,
      endDate,
      existingCover?.url,
      existingCoverType,
      existingImages,
      existingVideo?.url,
      imagesPreviews,
      newCoverType,
      startDate,
      title,
      videoPreview,
      coverFile,
    ]
  );

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Sol: metin alanları */}
      <div className="lg:col-span-3 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Başlık
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`mt-2 ${inputCls}`}
            placeholder="Proje başlığı"
          />
        </div>

        <div className="grid gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Açıklama
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:hover:border-slate-500"
            >
              {showPreview ? "Önizlemeyi gizle" : "Önizleme göster"}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className={`mt-2 ${inputCls}`}
            placeholder="Proje açıklaması"
          />
        </div>

        {showPreview && <ProjectPreview preview={previewData} />}

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kategori
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`mt-2 ${inputCls}`}
            placeholder="Örn: Su Yalıtımı"
          />
        </div>

        {/* Başlangıç ve Bitiş tarihi alanları */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Başlangıç Tarihi
          </label>
          <input
            type="date"
            value={startDate ? startDate.split("T")[0] : ""}
            onChange={(e) => setStartDate(e.target.value)}
            className={`mt-2 ${inputCls}`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Bitiş Tarihi
          </label>
          <input
            type="date"
            value={endDate ? endDate.split("T")[0] : ""}
            onChange={(e) => setEndDate(e.target.value)}
            className={`mt-2 ${inputCls}`}
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
            Kapak Medyası (zorunlu) — Görsel veya Video
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleCoverChange}
            className="mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
          />
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            {coverPreview ? (
              <MediaPreview
                src={coverPreview}
                type={newCoverType}
                className="w-full"
              />
            ) : existingCover ? (
              <MediaPreview
                src={existingCover.url}
                type={existingCoverType}
                className="w-full"
              />
            ) : (
              <div className="aspect-video grid place-items-center text-xs text-gray-400">
                Önizleme
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Büyük videolar için .mp4 önerilir. Görseller otomatik optimize
            edilir.
          </p>
        </div>

        {/* Opsiyonel tek video */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Opsiyonel Video (tek)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
          />
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            {videoPreview ? (
              <MediaPreview
                src={videoPreview}
                type="video"
                className="w-full"
              />
            ) : existingVideo ? (
              <MediaPreview
                src={existingVideo.url}
                type="video"
                className="w-full"
              />
            ) : (
              <div className="aspect-video grid place-items-center text-xs text-gray-400">
                Önizleme
              </div>
            )}
          </div>
        </div>

        {/* Opsiyonel görseller (max 4 toplam) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Opsiyonel Görseller (max 4) — Kalan eklenebilir:{" "}
            {remainingImageSlots}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100"
            disabled={remainingImageSlots === 0}
          />
          {!!existingImages.length && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                  alt=""
                />
              ))}
            </div>
          )}
          {!!imagesPreviews.length && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {imagesPreviews.map((u, i) => (
                <img
                  key={i}
                  src={u}
                  className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                  alt=""
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
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

ProjectForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
      resourceType: PropTypes.oneOf(["image", "video"]),
    }),
    video: PropTypes.shape({
      url: PropTypes.string,
      resourceType: PropTypes.oneOf(["video"]),
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        resourceType: PropTypes.oneOf(["image"]),
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default ProjectForm;
