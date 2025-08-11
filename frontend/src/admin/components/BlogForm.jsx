import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

/* küçük yardımcılar */
const MediaPreview = ({ src, type = "image", className = "" }) =>
  type === "video" ? (
    <video src={src} className={className} controls playsInline muted />
  ) : (
    <img src={src} className={className} alt="" />
  );

MediaPreview.propTypes = {
  src: PropTypes.string,
  type: PropTypes.oneOf(["image", "video"]),
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

const BlogForm = ({ initialData, onSubmit }) => {
  const isEdit = Boolean(initialData?._id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags : []
  );

  const [tagInput, setTagInput] = useState("");

  // mevcut medya
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
  const [assetFiles, setAssetFiles] = useState([]);

  // önizlemeler
  const [coverPreview, setCoverPreview] = useState(null);
  const [assetPreviews, setAssetPreviews] = useState([]);
  const revokers = useRef([]);

  useEffect(() => {
    return () => {
      revokers.current.forEach(
        (u) => u?.startsWith("blob:") && URL.revokeObjectURL(u)
      );
      revokers.current = [];
    };
  }, []);

  const blobify = (file, setter) => {
    if (!file) return setter(null);
    const u = URL.createObjectURL(file);
    revokers.current.push(u);
    setter(u);
  };

  const onAddTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((arr) => [...arr, v]);
    setTagInput("");
  };

  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      onAddTag();
    }
  };

  const removeTag = (t) => setTags((arr) => arr.filter((x) => x !== t));

  const onCoverChange = (e) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    blobify(f, setCoverPreview);
  };

  const onAssetsChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAssetFiles(files);
    // eski blobları temizle
    assetPreviews.forEach(
      (u) => u?.startsWith("blob:") && URL.revokeObjectURL(u)
    );
    const urls = files.map((f) => {
      const u = URL.createObjectURL(f);
      revokers.current.push(u);
      return u;
    });
    setAssetPreviews(urls);
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
    fd.append("tags", JSON.stringify(tags));
    if (coverFile) fd.append("cover", coverFile);
    assetFiles.forEach((f) => fd.append("assets", f));

    onSubmit(fd);
  };

  const existingCoverType = existingCover?.resourceType || "image";

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      noValidate
    >
      {/* sol: metin alanları */}
      <div className="lg:col-span-3 space-y-5">
        <div>
          <label className="block text-sm font-medium">Başlık *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Blog başlığı"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">İçerik *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
            className="mt-1 w-full rounded-md border px-3 py-2 leading-relaxed"
            placeholder="Blog içeriği…"
          />
        </div>

        {/* tags */}
        <div>
          <label className="block text-sm font-medium">
            Etiketler (opsiyonel)
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <Chip key={t} text={t} onRemove={() => removeTag(t)} />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Etiket yaz ve Enter’a bas"
            />
            <button
              type="button"
              onClick={onAddTag}
              className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            >
              Ekle
            </button>
          </div>
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

      {/* sağ: medya */}
      <div className="lg:col-span-2 space-y-6">
        {/* kapak */}
        <div>
          <label className="block text-sm font-semibold">
            Kapak Görseli {isEdit ? "(mevcut varsa opsiyonel)" : "(zorunlu)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onCoverChange}
            className="mt-2 w-full"
          />
          <div className="mt-2 overflow-hidden rounded-lg border bg-gray-50">
            {coverPreview ? (
              <MediaPreview src={coverPreview} className="w-full" />
            ) : existingCover?.url ? (
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
          <p className="mt-1 text-xs text-gray-500">JPEG/PNG/WEBP önerilir.</p>
        </div>

        {/* assets */}
        <div>
          <label className="block text-sm font-semibold">
            Ek Medyalar (opsiyonel — görsel/video çoklu)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={onAssetsChange}
            className="mt-2 w-full"
          />

          {!!existingAssets.length && (
            <>
              <p className="mt-2 text-xs text-gray-500">
                Mevcut medyalar (bu ekranda silme yok; yeni yüklenenler
                **eklenir**)
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {existingAssets.map((m) => (
                  <MediaPreview
                    key={m.publicId}
                    src={m.url}
                    type={m.resourceType}
                    className="h-20 w-full rounded-md object-cover border"
                  />
                ))}
              </div>
            </>
          )}

          {!!assetPreviews.length && (
            <>
              <p className="mt-3 text-xs text-gray-500">Yeni eklenecekler</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {assetPreviews.map((u, i) => (
                  <img
                    key={String(i)}
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

BlogForm.propTypes = {
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.shape({
      url: PropTypes.string,
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
};

export default BlogForm;
