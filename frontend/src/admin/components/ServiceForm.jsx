// src/admin/components/ServiceForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

/* ------- Küçük yardımcı bileşenler ------- */
const MediaPreview = ({ src, className = "" }) => {
  if (!src) return null;
  return <img src={src} className={className} alt="" />;
};
MediaPreview.propTypes = {
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
      console.error("JSON parse error:", val);
    }
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

/* ------------- Ana Form ------------- */
const ServiceForm = ({ initialData, onSubmit }) => {
  const isEdit = Boolean(initialData?._id);

  // Mevcut medya (yalnızca görüntüleme için)
  const existingCover = useMemo(
    () => initialData?.cover || null,
    [initialData?.cover]
  );
  const existingImages = useMemo(
    () => initialData?.images || [],
    [initialData?.images]
  );

  // Metin alanları (initialData değişirse güncelle)
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
  }, [initialData?._id]); // farklı kayıt yüklendiğinde tazele

  const [usageInput, setUsageInput] = useState("");

  // Yeni seçilen dosyalar
  const [coverFile, setCoverFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);

  // Önizlemeler
  const [coverPreview, setCoverPreview] = useState(null);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const revokers = useRef([]);

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

  const handleCoverChange = (e) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    blobify(f, setCoverPreview);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImagesFiles(files);
    // Eski blobları temizle
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
      // eslint-disable-next-line no-alert
      alert("Kapak görseli zorunludur.");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("type", type);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("usageAreas", JSON.stringify(usageAreas)); // backend JSON.parse ediyor

    if (coverFile) fd.append("cover", coverFile); // REPLACE
    imagesFiles.forEach((f) => fd.append("images", f)); // EKLE

    onSubmit(fd);
  };

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
        {/* Kapak görseli */}
        <div>
          <label className="block text-sm font-semibold">
            Kapak Görseli {isEdit ? "(mevcut varsa opsiyonel)" : "(zorunlu)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="mt-2 w-full"
          />
          <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">
            {coverPreview ? (
              <MediaPreview src={coverPreview} className="w-full" />
            ) : existingCover?.url ? (
              <MediaPreview src={existingCover.url} className="w-full" />
            ) : (
              <div className="aspect-video grid place-items-center text-xs text-gray-400">
                Önizleme
              </div>
            )}
          </div>
        </div>

        {/* Alt görseller (çoklu) */}
        <div>
          <label className="block text-sm font-semibold">
            Alt Görseller (opsiyonel, çoklu)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="mt-2 w-full"
          />

          {!!existingImages.length && (
            <>
              <p className="mt-2 text-xs text-gray-500">
                Mevcut görseller (silme bu ekranda yok; yeniler **eklenir**)
              </p>
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
            </>
          )}

          {!!imagesPreviews.length && (
            <>
              <p className="mt-3 text-xs text-gray-500">Yeni eklenecekler</p>
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
            </>
          )}
        </div>
      </div>
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
      PropTypes.string, // defansif: DB'den string geldiyse uyarı olmasın
    ]),
    description: PropTypes.string,
    cover: PropTypes.shape({ url: PropTypes.string }),
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })),
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default ServiceForm;
