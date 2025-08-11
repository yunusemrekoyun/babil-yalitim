import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

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

const JournalForm = ({ initialData, onSubmit, onRemoveAsset }) => {
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
      alert("Kapak görseli zorunludur.");
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
          <label className="block text-sm font-medium">Başlık *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Örn: X firması ile anlaşma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">İçerik *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="mt-1 w-full rounded-md border px-3 py-2 leading-relaxed"
            placeholder="Habere dair detaylar…"
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

      {/* Sağ: medya alanları */}
      <div className="lg:col-span-2 space-y-6">
        {/* Kapak */}
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
              <MediaThumb src={coverPreview} className="w-full" />
            ) : existingCover?.url ? (
              <MediaThumb src={existingCover.url} className="w-full" />
            ) : (
              <div className="aspect-video grid place-items-center text-xs text-gray-400">
                Önizleme
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Kapak için PNG/JPEG/WEBP önerilir.
          </p>
        </div>

        {/* Alt medya (image/video çoklu) */}
        <div>
          <label className="block text-sm font-semibold">
            Alt Medya (opsiyonel, çoklu — resim ya da video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleAssetsChange}
            className="mt-2 w-full"
          />

          {!!existingAssets.length && (
            <>
              <p className="mt-2 text-xs text-gray-500">Mevcut medya</p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {existingAssets.map((m) => (
                  <div
                    key={m.publicId}
                    className="relative rounded border overflow-hidden"
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
                        className="absolute right-1 top-1 rounded bg-red-600/90 px-2 py-0.5 text-xs text-white hover:bg-red-700"
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
              <p className="mt-3 text-xs text-gray-500">Yeni eklenecekler</p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {assetsPreviews.map((u, i) => (
                  <MediaThumb
                    key={i}
                    src={u}
                    className="h-28 w-full object-cover rounded border"
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
  onRemoveAsset: PropTypes.func, // sadece edit ekranında kullanılıyor
};

export default JournalForm;
