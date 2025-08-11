// src/admin/components/ProjectForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

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

const ProjectForm = ({ initialData, onSubmit }) => {
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
      return alert("Kapak medyası zorunludur (görsel ya da video).");
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

    for (const [k, v] of fd.entries()) {
      console.log(
        k,
        v instanceof File ? { name: v.name, type: v.type, size: v.size } : v
      );
    }
    onSubmit(fd);
  };

  const existingCoverType = existingCover?.resourceType || "image";
  const newCoverType = coverFile?.type?.startsWith("video") ? "video" : "image";

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Sol: metin alanları */}
      <div className="lg:col-span-3 space-y-4">
        <div>
          <label className="block text-sm font-medium">Başlık</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Proje başlığı"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Proje açıklaması"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Kategori</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Örn: Su Yalıtımı"
          />
        </div>

        {/* Başlangıç ve Bitiş tarihi alanları */}
        <div>
          <label className="block text-sm font-medium">Başlangıç Tarihi</label>
          <input
            type="date"
            value={startDate ? startDate.split("T")[0] : ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bitiş Tarihi</label>
          <input
            type="date"
            value={endDate ? endDate.split("T")[0] : ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Kaydet
          </button>
        </div>
      </div>

      {/* Sağ: medya alanları */}
      <div className="lg:col-span-2 space-y-6">
        {/* Kapak */}
        <div>
          <label className="block text-sm font-semibold">
            Kapak Medyası (zorunlu) — Görsel veya Video
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleCoverChange}
            className="mt-2 w-full"
          />
          <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">
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
          <p className="mt-1 text-xs text-gray-500">
            Büyük videolar için .mp4 önerilir. Görseller otomatik optimize
            edilir.
          </p>
        </div>

        {/* Opsiyonel tek video */}
        <div>
          <label className="block text-sm font-semibold">
            Opsiyonel Video (tek)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-2 w-full"
          />
          <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">
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
          <label className="block text-sm font-semibold">
            Opsiyonel Görseller (max 4) — Kalan eklenebilir:{" "}
            {remainingImageSlots}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="mt-2 w-full"
            disabled={remainingImageSlots === 0}
          />
          {!!existingImages.length && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  className="h-20 w-full rounded-md object-cover border"
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
                  className="h-20 w-full rounded-md object-cover border"
                  alt=""
                />
              ))}
            </div>
          )}
        </div>
      </div>
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
};

export default ProjectForm;
