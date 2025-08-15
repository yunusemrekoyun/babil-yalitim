// src/admin/components/ServiceForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import ToastAlert from "./ToastAlert";

/* ------- Küçük yardımcı bileşenler ------- */
const ImagePreview = ({ src, className = "" }) => {
  if (!src) return null;
  return <img src={src} className={className} alt="" />;
};
ImagePreview.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
};

const VideoPreview = ({ src, className = "" }) => {
  if (!src) return null;
  return (
    <video
      src={src}
      className={className}
      muted
      loop
      controls
      playsInline
      preload="metadata"
    />
  );
};
VideoPreview.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
};

const Chip = ({ text, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
    {text}
    <button
      type="button"
      onClick={onRemove}
      className="ml-1 rounded-full px-1.5 hover:bg-gray-200"
      aria-label={`${text} etiketini kaldır`}
      title="Kaldır"
    >
      ×
    </button>
  </span>
);
Chip.propTypes = {
  text: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

// gelen değeri diziye çevir: ["a","b"] | '["a","b"]' | "a,b"
const normalizeAreas = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed))
        return parsed.filter(Boolean).map((s) => String(s).trim());
    } catch {
      // noop
    }
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// Front tarafta min oran (backend default: 1.5). İstersen .env ile eşitle.
const FRONT_VERTICAL_MIN_RATIO = 1.5;

/** Seçilen dosyanın dikey olup olmadığını kontrol eder. (image|video) */
const checkPortrait = (file, minRatio = FRONT_VERTICAL_MIN_RATIO) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(true);

    const type = file.type || "";
    const url = URL.createObjectURL(file);

    const done = (ok, metaMsg = "") => {
      URL.revokeObjectURL(url);
      ok ? resolve(true) : reject(new Error(metaMsg));
    };

    if (type.startsWith("video/")) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.src = url;
      v.onloadedmetadata = () => {
        const w = v.videoWidth || 0;
        const h = v.videoHeight || 0;
        const ratio = h / w;
        if (!w || !h) return done(false, "Video boyutları okunamadı.");
        if (h < w || ratio < minRatio) {
          return done(
            false,
            `Lütfen dikey bir video seçin. (min oran: ${minRatio}:1)`
          );
        }
        done(true);
      };
      v.onerror = () => done(false, "Video okunamadı.");
      return;
    }

    if (type.startsWith("image/")) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const w = img.naturalWidth || 0;
        const h = img.naturalHeight || 0;
        const ratio = h / w;
        if (!w || !h) return done(false, "Görsel boyutları okunamadı.");
        if (h < w || ratio < minRatio) {
          return done(
            false,
            `Lütfen dikey bir görsel seçin. (min oran: ${minRatio}:1)`
          );
        }
        done(true);
      };
      img.onerror = () => done(false, "Görsel okunamadı.");
      return;
    }

    return done(false, "Desteklenmeyen dosya türü.");
  });

/* ------------- Ana Form ------------- */
const ServiceForm = ({ initialData, onSubmit }) => {
  const isEdit = Boolean(initialData?._id);

  // Mevcut medya (görüntüleme)
  const existingCover = useMemo(
    () => initialData?.cover || null,
    [initialData?.cover]
  );
  const existingImages = useMemo(
    () => initialData?.images || [],
    [initialData?.images]
  );

  // Metin alanları
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState(initialData?.type || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [usageAreas, setUsageAreas] = useState(
    normalizeAreas(initialData?.usageAreas)
  );
  useEffect(() => {
    setTitle(initialData?.title || "");
    setType(initialData?.type || "");
    setCategory(initialData?.category || "");
    setDescription(initialData?.description || "");
    setUsageAreas(normalizeAreas(initialData?.usageAreas));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?._id]);

  const [usageInput, setUsageInput] = useState("");

  // Yeni seçilen dosyalar
  const [coverFile, setCoverFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);

  // Önizlemeler
  const [coverPreview, setCoverPreview] = useState(null);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const revokers = useRef([]);

  // Hata mesajı + toast
  const [mediaError, setMediaError] = useState("");
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // mediaError değişince toast da göster
  useEffect(() => {
    if (mediaError) showToast(mediaError, "error");
  }, [mediaError]);

  // Cleanup — blob URL’leri serbest bırak
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

  const addUsage = () => {
    const v = usageInput.trim();
    if (!v) return;
    if (!usageAreas.includes(v)) {
      setUsageAreas((arr) => [...arr, v]);
    } else {
      showToast("Bu kullanım alanı zaten ekli.", "info", 2500);
    }
    setUsageInput("");
  };

  const onUsageKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addUsage();
    }
  };

  const removeUsage = (value) => {
    setUsageAreas((arr) => arr.filter((x) => x !== value));
  };

  const handleCoverChange = async (e) => {
    setMediaError("");
    const f = e.target.files?.[0] || null;
    if (!f) {
      setCoverFile(null);
      setCoverPreview(null);
      return;
    }
    try {
      await checkPortrait(f);
      setCoverFile(f);
      blobify(f, setCoverPreview);
    } catch (err) {
      const msg = err.message || "Kapak dosyası kabul edilmedi.";
      setMediaError(msg);
      e.target.value = "";
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  const handleImagesChange = async (e) => {
    setMediaError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setImagesFiles([]);
      setImagesPreviews([]);
      return;
    }
    for (const f of files) {
      try {
        await checkPortrait(f);
      } catch (err) {
        const msg =
          err.message ||
          "Galeri dosyalarından biri dikey değil. Lütfen kontrol edin.";
        setMediaError(msg);
        e.target.value = "";
        setImagesFiles([]);
        setImagesPreviews([]);
        return;
      }
    }
    setImagesFiles(files);
    imagesPreviews.forEach((u) => {
      if (u?.startsWith("blob:")) URL.revokeObjectURL(u);
    });
    const urls = files.map((f) => {
      const u = URL.createObjectURL(f);
      revokers.current.push(u);
      return u;
    });
    setImagesPreviews(urls);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!isEdit && !coverFile) {
      showToast("Kapak (dikey image/video) zorunludur.", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("type", type);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("usageAreas", JSON.stringify(usageAreas));

    if (coverFile) fd.append("cover", coverFile);
    imagesFiles.forEach((f) => fd.append("images", f));

    onSubmit(fd);
  };

  // Mevcut kapak türü
  const existingCoverIsVideo =
    existingCover?.resourceType === "video" ||
    (existingCover?.url || "").includes(".mp4");

  const coverPreviewIsVideo =
    coverPreview && coverFile?.type?.startsWith("video/");
  const coverPreviewIsImage =
    coverPreview && coverFile?.type?.startsWith("image/");

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      noValidate
    >
      {/* Sol kolon: metin alanları */}
      <div className="lg:col-span-3 space-y-5">
        <div>
          <label className="block text-sm font-medium">Hizmet Adı *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Örn: Teras Su Yalıtımı"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hizmet Türü *</label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Örn: Su Yalıtımı"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Kategori</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Örn: Çatı, Teras, Temel"
          />
        </div>

        {/* Kullanım Alanları (chip/tag) */}
        <div>
          <label className="block text-sm font-medium">
            Kullanım Alanları (opsiyonel)
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {usageAreas.map((u) => (
              <Chip key={u} text={u} onRemove={() => removeUsage(u)} />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={usageInput}
              onChange={(e) => setUsageInput(e.target.value)}
              onKeyDown={onUsageKeyDown}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Bir kullanım alanı yazın ve Enter’a basın"
            />
            <button
              type="button"
              onClick={addUsage}
              className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            >
              Ekle
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Örn: Temel, perde beton, ıslak hacim, havuz…
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={7}
            className="mt-1 w-full rounded-md border px-3 py-2 leading-relaxed"
            placeholder="Hizmet ile ilgili detaylı açıklama…"
          />
        </div>

        {!!mediaError && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {mediaError}
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
          >
            Kaydet
          </button>
        </div>
      </div>

      {/* Sağ kolon: medya alanları */}
      <div className="lg:col-span-2 space-y-6">
        {/* Kapak (image | video) */}
        <div>
          <label className="block text-sm font-semibold">
            Kapak (Dikey image veya video)
            {isEdit ? " — mevcut varsa opsiyonel" : " — zorunlu"}
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleCoverChange}
            className="mt-2 w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            Öneri: 9:16 (ör. 1080×1920). Minimum en-boy oranı{" "}
            {FRONT_VERTICAL_MIN_RATIO}:1.
          </p>
          <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">
            {coverPreview ? (
              coverPreviewIsVideo ? (
                <VideoPreview
                  src={coverPreview}
                  className="w-full aspect-[9/16] object-cover"
                />
              ) : coverPreviewIsImage ? (
                <ImagePreview
                  src={coverPreview}
                  className="w-full aspect-[9/16] object-cover"
                />
              ) : (
                <div className="aspect-[9/16] grid place-items-center text-xs text-gray-400">
                  Önizleme
                </div>
              )
            ) : existingCover?.url ? (
              existingCoverIsVideo ? (
                <VideoPreview
                  src={existingCover.url}
                  className="w-full aspect-[9/16] object-cover"
                />
              ) : (
                <ImagePreview
                  src={existingCover.url}
                  className="w-full aspect-[9/16] object-cover"
                />
              )
            ) : (
              <div className="aspect-[9/16] grid place-items-center text-xs text-gray-400">
                Önizleme
              </div>
            )}
          </div>
        </div>

        {/* Alt medya (çoklu image | video) */}
        <div>
          <label className="block text-sm font-semibold">
            Alt Medya (opsiyonel, çoklu — image/video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleImagesChange}
            className="mt-2 w-full"
          />

          {!!existingImages.length && (
            <>
              <p className="mt-2 text-xs text-gray-500">
                Mevcut medya (silme bu ekranda yok; yeniler{" "}
                <strong>eklenir</strong>)
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {existingImages.map((m, i) =>
                  m.resourceType === "video" ? (
                    <video
                      key={i}
                      src={m.url}
                      className="h-20 w-full rounded-md object-cover border"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      key={i}
                      src={m.url}
                      className="h-20 w-full rounded-md object-cover border"
                      alt=""
                    />
                  )
                )}
              </div>
            </>
          )}

          {!!imagesPreviews.length && (
            <>
              <p className="mt-3 text-xs text-gray-500">Yeni eklenecekler</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {imagesPreviews.map((u, i) => {
                  const isVid = (imagesFiles[i]?.type || "").startsWith(
                    "video/"
                  );
                  return isVid ? (
                    <video
                      key={i}
                      src={u}
                      className="h-20 w-full rounded-md object-cover border"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      key={i}
                      src={u}
                      className="h-20 w-full rounded-md object-cover border"
                      alt=""
                    />
                  );
                })}
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

ServiceForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    usageAreas: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    description: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
      resourceType: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        resourceType: PropTypes.string,
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default ServiceForm;
