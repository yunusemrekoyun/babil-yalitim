import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import ToastAlert from "./ToastAlert";
import { ServicePreview } from "./previews/ContentPreviews";

const inputCls =
  "w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950/55 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

const helperTextCls = "mt-2 text-xs text-slate-500 dark:text-slate-300";
const fileCls =
  "mt-2 w-full text-sm text-slate-600 dark:text-slate-200 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-[#2c2f36] dark:file:text-slate-100";

const FRONT_VERTICAL_MIN_RATIO = 1.5;

const createClientId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toMediaType = (fileOrMedia) => {
  if (!fileOrMedia) return "image";
  if (fileOrMedia.resourceType) return fileOrMedia.resourceType;
  if (fileOrMedia.type) return fileOrMedia.type.startsWith("video/") ? "video" : "image";
  return "image";
};

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
  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-100">
    {text}
    <button
      type="button"
      onClick={onRemove}
      className="ml-1 rounded-full px-1.5 hover:bg-slate-200 dark:hover:bg-slate-700"
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

const normalizeAreas = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed))
        return parsed.filter(Boolean).map((item) => String(item).trim());
    } catch {
      /* noop */
    }
    return val
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const makeEmptySubService = (seed = {}) => ({
  id: seed?._id || "",
  clientId: seed?.clientId || seed?._id || createClientId(),
  title: seed?.title || "",
  type: seed?.type || "",
  category: seed?.category || "",
  description: seed?.description || "",
  usageAreas: normalizeAreas(seed?.usageAreas),
  usageInput: "",
  coverFile: null,
  coverPreview: "",
  imagesFiles: [],
  imagePreviews: [],
  existingCover: seed?.cover || null,
  existingImages: seed?.images || [],
  open: true,
});

const checkPortrait = (file, minRatio = FRONT_VERTICAL_MIN_RATIO) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(true);

    const type = file.type || "";
    const url = URL.createObjectURL(file);

    const done = (ok, message = "") => {
      URL.revokeObjectURL(url);
      ok ? resolve(true) : reject(new Error(message));
    };

    if (type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      video.onloadedmetadata = () => {
        const width = video.videoWidth || 0;
        const height = video.videoHeight || 0;
        const ratio = height / width;
        if (!width || !height) return done(false, "Video boyutları okunamadı.");
        if (height < width || ratio < minRatio) {
          return done(
            false,
            `Lütfen dikey bir video seçin. (min oran: ${minRatio}:1)`
          );
        }
        done(true);
      };
      video.onerror = () => done(false, "Video okunamadı.");
      return;
    }

    if (type.startsWith("image/")) {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        const width = image.naturalWidth || 0;
        const height = image.naturalHeight || 0;
        const ratio = height / width;
        if (!width || !height) return done(false, "Görsel boyutları okunamadı.");
        if (height < width || ratio < minRatio) {
          return done(
            false,
            `Lütfen dikey bir görsel seçin. (min oran: ${minRatio}:1)`
          );
        }
        done(true);
      };
      image.onerror = () => done(false, "Görsel okunamadı.");
      return;
    }

    done(false, "Desteklenmeyen dosya türü.");
  });

const ServiceForm = ({ initialData, onSubmit, submitting }) => {
  const isEdit = Boolean(initialData?._id);

  const existingCover = useMemo(
    () => initialData?.cover || null,
    [initialData?.cover]
  );
  const existingImages = useMemo(
    () => initialData?.images || [],
    [initialData?.images]
  );

  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState(initialData?.type || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [usageAreas, setUsageAreas] = useState(
    normalizeAreas(initialData?.usageAreas)
  );
  const [usageInput, setUsageInput] = useState("");
  const [subServices, setSubServices] = useState(
    (initialData?.subServices || []).map((item) => makeEmptySubService(item))
  );
  const [showPreview, setShowPreview] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const revokers = useRef([]);

  const [mediaError, setMediaError] = useState("");
  const [toast, setToast] = useState(null);
  const showToast = (msg, typeValue = "info", duration = 4000) =>
    setToast({ msg, type: typeValue, duration });

  useEffect(() => {
    setTitle(initialData?.title || "");
    setType(initialData?.type || "");
    setCategory(initialData?.category || "");
    setDescription(initialData?.description || "");
    setUsageAreas(normalizeAreas(initialData?.usageAreas));
    setSubServices(
      (initialData?.subServices || []).map((item) => makeEmptySubService(item))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?._id]);

  useEffect(() => {
    if (mediaError) showToast(mediaError, "error");
  }, [mediaError]);

  useEffect(() => {
    return () => {
      revokers.current.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      revokers.current = [];
    };
  }, []);

  const rememberUrl = (file) => {
    if (!file) return "";
    const url = URL.createObjectURL(file);
    revokers.current.push(url);
    return url;
  };

  const addUsage = () => {
    const value = usageInput.trim();
    if (!value) return;
    if (!usageAreas.includes(value)) {
      setUsageAreas((items) => [...items, value]);
    } else {
      showToast("Bu kullanım alanı zaten ekli.", "info", 2500);
    }
    setUsageInput("");
  };

  const onUsageKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addUsage();
    }
  };

  const updateSubService = (clientId, updater) => {
    setSubServices((items) =>
      items.map((item) =>
        item.clientId === clientId ? { ...item, ...updater(item) } : item
      )
    );
  };

  const handleCoverChange = async (event) => {
    setMediaError("");
    const file = event.target.files?.[0] || null;
    if (!file) {
      setCoverFile(null);
      setCoverPreview("");
      return;
    }
    try {
      await checkPortrait(file);
      setCoverFile(file);
      setCoverPreview(rememberUrl(file));
    } catch (error) {
      setMediaError(error.message || "Kapak dosyası kabul edilmedi.");
      event.target.value = "";
      setCoverFile(null);
      setCoverPreview("");
    }
  };

  const handleImagesChange = async (event) => {
    setMediaError("");
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      setImagesFiles([]);
      setImagesPreviews([]);
      return;
    }
    for (const file of files) {
      try {
        await checkPortrait(file);
      } catch (error) {
        setMediaError(error.message || "Galeri dosyalarından biri geçersiz.");
        event.target.value = "";
        setImagesFiles([]);
        setImagesPreviews([]);
        return;
      }
    }
    setImagesFiles(files);
    setImagesPreviews(files.map((file) => rememberUrl(file)));
  };

  const addSubService = () => {
    setSubServices((items) => [...items, makeEmptySubService()]);
  };

  const removeSubService = (clientId) => {
    setSubServices((items) => items.filter((item) => item.clientId !== clientId));
  };

  const handleSubServiceCover = async (clientId, file) => {
    if (!file) {
      updateSubService(clientId, () => ({
        coverFile: null,
        coverPreview: "",
      }));
      return;
    }

    await checkPortrait(file);
    updateSubService(clientId, () => ({
      coverFile: file,
      coverPreview: rememberUrl(file),
    }));
  };

  const handleSubServiceImages = async (clientId, files) => {
    for (const file of files) {
      await checkPortrait(file);
    }

    updateSubService(clientId, () => ({
      imagesFiles: files,
      imagePreviews: files.map((file) => rememberUrl(file)),
    }));
  };

  const validateSubServices = () => {
    for (let index = 0; index < subServices.length; index += 1) {
      const item = subServices[index];
      if (!item.title.trim()) {
        showToast(`Alt hizmet ${index + 1} için başlık zorunlu.`, "error");
        return false;
      }
      if (!item.description.trim()) {
        showToast(`Alt hizmet ${index + 1} için açıklama zorunlu.`, "error");
        return false;
      }
      if (!item.coverFile && !item.existingCover?.url) {
        showToast(`Alt hizmet ${index + 1} için kapak zorunlu.`, "error");
        return false;
      }
    }
    return true;
  };

  const submit = (event) => {
    event.preventDefault();

    if (!isEdit && !coverFile) {
      showToast("Kapak (dikey image/video) zorunludur.", "error");
      return;
    }
    if (!validateSubServices()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("usageAreas", JSON.stringify(usageAreas));
    formData.append(
      "subServices",
      JSON.stringify(
        subServices.map((item) => ({
          id: item.id,
          clientId: item.clientId,
          title: item.title,
          type: item.type,
          category: item.category,
          description: item.description,
          usageAreas: item.usageAreas,
        }))
      )
    );

    if (coverFile) formData.append("cover", coverFile);
    imagesFiles.forEach((file) => formData.append("images", file));

    subServices.forEach((item) => {
      if (item.coverFile) {
        formData.append(`subServiceCover__${item.clientId}`, item.coverFile);
      }
      item.imagesFiles.forEach((file) =>
        formData.append(`subServiceImages__${item.clientId}`, file)
      );
    });

    onSubmit(formData);
  };

  const previewData = useMemo(
    () => ({
      title,
      type,
      category,
      description,
      usageAreas,
      cover: {
        src: coverPreview || existingCover?.url || "",
        type: coverFile ? toMediaType(coverFile) : existingCover?.resourceType || "image",
        alt: title,
      },
      images: imagesPreviews.length
        ? imagesPreviews.map((src, index) => ({
            src,
            type: toMediaType(imagesFiles[index]),
            alt: `${title}-asset-${index + 1}`,
          }))
        : existingImages.map((item) => ({
            src: item.url,
            type: item.resourceType || "image",
            alt: `${title}-asset`,
          })),
      subServices: subServices.map((item, index) => ({
        id: item.id || item.clientId,
        title: item.title || `Alt Hizmet ${index + 1}`,
        type: item.type,
        category: item.category,
        description: item.description,
        usageAreas: item.usageAreas,
        cover: {
          src: item.coverPreview || item.existingCover?.url || "",
          type: item.coverFile
            ? toMediaType(item.coverFile)
            : item.existingCover?.resourceType || "image",
          alt: item.title,
        },
        images: item.imagePreviews.length
          ? item.imagePreviews.map((src, imageIndex) => ({
              src,
              type: toMediaType(item.imagesFiles[imageIndex]),
              alt: `${item.title}-asset-${imageIndex + 1}`,
            }))
          : (item.existingImages || []).map((image) => ({
              src: image.url,
              type: image.resourceType || "image",
              alt: `${item.title}-asset`,
            })),
      })),
    }),
    [
      category,
      coverFile,
      coverPreview,
      description,
      existingCover,
      existingImages,
      imagesFiles,
      imagesPreviews,
      subServices,
      title,
      type,
      usageAreas,
    ]
  );

  const existingCoverIsVideo =
    existingCover?.resourceType === "video" ||
    (existingCover?.url || "").includes(".mp4");

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      noValidate
    >
      <div className="space-y-5 lg:col-span-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Hizmet Adı *
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className={`mt-2 ${inputCls}`}
            placeholder="Örn: Teras Su Yalıtımı"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Hizmet Türü *
          </label>
          <input
            value={type}
            onChange={(event) => setType(event.target.value)}
            required
            className={`mt-2 ${inputCls}`}
            placeholder="Örn: Su Yalıtımı"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kategori
          </label>
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`mt-2 ${inputCls}`}
            placeholder="Örn: Çatı, Teras, Temel"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kullanım Alanları (opsiyonel)
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {usageAreas.map((area) => (
              <Chip
                key={area}
                text={area}
                onRemove={() =>
                  setUsageAreas((items) => items.filter((item) => item !== area))
                }
              />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={usageInput}
              onChange={(event) => setUsageInput(event.target.value)}
              onKeyDown={onUsageKeyDown}
              className={inputCls}
              placeholder="Bir kullanım alanı yazın ve Enter’a basın"
            />
            <button type="button" onClick={addUsage} className="btn-admin-primary">
              Ekle
            </button>
          </div>
          <p className={helperTextCls}>
            Örn: Temel, perde beton, ıslak hacim, havuz…
          </p>
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
            onChange={(event) => setDescription(event.target.value)}
            rows={7}
            className={`mt-2 w-full leading-relaxed ${inputCls}`}
            placeholder="Hizmet ile ilgili detaylı açıklama…"
          />
        </div>

        {showPreview && <ServicePreview preview={previewData} />}

        <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/55">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Alt Hizmetler
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Üst hizmet altında görünecek bağlı hizmetleri buradan yönetin.
              </p>
            </div>
            <button type="button" onClick={addSubService} className="btn-admin-primary">
              Alt hizmet ekle
            </button>
          </div>

          {subServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
              Henüz alt hizmet eklenmedi.
            </div>
          ) : (
            <div className="space-y-4">
              {subServices.map((item, index) => {
                const existingSubCoverIsVideo =
                  item.existingCover?.resourceType === "video" ||
                  (item.existingCover?.url || "").includes(".mp4");

                return (
                  <div
                    key={item.clientId}
                    className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/60"
                  >
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                          Alt Hizmet {index + 1}
                        </p>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {item.title || "Yeni alt hizmet"}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateSubService(item.clientId, (current) => ({
                              open: !current.open,
                            }))
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:hover:border-slate-500"
                        >
                          {item.open ? "Daralt" : "Genişlet"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSubService(item.clientId)}
                          className="btn-admin-danger"
                        >
                          Alt hizmeti sil
                        </button>
                      </div>
                    </div>

                    {item.open && (
                      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Başlık *
                            </label>
                            <input
                              value={item.title}
                              onChange={(event) =>
                                updateSubService(item.clientId, () => ({
                                  title: event.target.value,
                                }))
                              }
                              className={`mt-2 ${inputCls}`}
                              placeholder="Alt hizmet başlığı"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Tür
                            </label>
                            <input
                              value={item.type}
                              onChange={(event) =>
                                updateSubService(item.clientId, () => ({
                                  type: event.target.value,
                                }))
                              }
                              className={`mt-2 ${inputCls}`}
                              placeholder="Alt hizmet türü"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Kategori
                            </label>
                            <input
                              value={item.category}
                              onChange={(event) =>
                                updateSubService(item.clientId, () => ({
                                  category: event.target.value,
                                }))
                              }
                              className={`mt-2 ${inputCls}`}
                              placeholder="Kategori"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Kullanım Alanları
                            </label>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {item.usageAreas.map((area) => (
                                <Chip
                                  key={`${item.clientId}-${area}`}
                                  text={area}
                                  onRemove={() =>
                                    updateSubService(item.clientId, (current) => ({
                                      usageAreas: current.usageAreas.filter(
                                        (entry) => entry !== area
                                      ),
                                    }))
                                  }
                                />
                              ))}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <input
                                value={item.usageInput}
                                onChange={(event) =>
                                  updateSubService(item.clientId, () => ({
                                    usageInput: event.target.value,
                                  }))
                                }
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === ","
                                  ) {
                                    event.preventDefault();
                                    const value = item.usageInput.trim();
                                    if (!value) return;
                                    updateSubService(item.clientId, (current) => ({
                                      usageAreas: current.usageAreas.includes(value)
                                        ? current.usageAreas
                                        : [...current.usageAreas, value],
                                      usageInput: "",
                                    }));
                                  }
                                }}
                                className={inputCls}
                                placeholder="Enter ile ekle"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const value = item.usageInput.trim();
                                  if (!value) return;
                                  updateSubService(item.clientId, (current) => ({
                                    usageAreas: current.usageAreas.includes(value)
                                      ? current.usageAreas
                                      : [...current.usageAreas, value],
                                    usageInput: "",
                                  }));
                                }}
                                className="btn-admin-primary"
                              >
                                Ekle
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Açıklama *
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(event) =>
                                updateSubService(item.clientId, () => ({
                                  description: event.target.value,
                                }))
                              }
                              rows={6}
                              className={`mt-2 ${inputCls}`}
                              placeholder="Alt hizmet açıklaması"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Kapak (zorunlu)
                            </label>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={async (event) => {
                                const file = event.target.files?.[0] || null;
                                try {
                                  await handleSubServiceCover(item.clientId, file);
                                } catch (error) {
                                  setMediaError(
                                    error.message ||
                                      "Alt hizmet kapağı kabul edilmedi."
                                  );
                                  event.target.value = "";
                                }
                              }}
                              className={fileCls}
                            />
                            <div className="admin-preview-surface mt-3 overflow-hidden">
                              {item.coverPreview ? (
                                toMediaType(item.coverFile) === "video" ? (
                                  <VideoPreview
                                    src={item.coverPreview}
                                    className="aspect-[9/16] w-full object-cover"
                                  />
                                ) : (
                                  <ImagePreview
                                    src={item.coverPreview}
                                    className="aspect-[9/16] w-full object-cover"
                                  />
                                )
                              ) : item.existingCover?.url ? (
                                existingSubCoverIsVideo ? (
                                  <VideoPreview
                                    src={item.existingCover.url}
                                    className="aspect-[9/16] w-full object-cover"
                                  />
                                ) : (
                                  <ImagePreview
                                    src={item.existingCover.url}
                                    className="aspect-[9/16] w-full object-cover"
                                  />
                                )
                              ) : (
                                <div className="grid aspect-[9/16] place-items-center text-xs text-slate-400 dark:text-slate-500">
                                  Önizleme
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Alt Medya (opsiyonel)
                            </label>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              onChange={async (event) => {
                                const files = Array.from(
                                  event.target.files || []
                                );
                                try {
                                  await handleSubServiceImages(
                                    item.clientId,
                                    files
                                  );
                                } catch (error) {
                                  setMediaError(
                                    error.message ||
                                      "Alt hizmet medyası kabul edilmedi."
                                  );
                                  event.target.value = "";
                                }
                              }}
                              className={fileCls}
                            />

                            {!!item.existingImages.length && (
                              <>
                                <p className={helperTextCls}>Mevcut medya</p>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                  {item.existingImages.map((media, mediaIndex) =>
                                    media.resourceType === "video" ? (
                                      <video
                                        key={`${item.clientId}-existing-${mediaIndex}`}
                                        src={media.url}
                                        className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                                        muted
                                        playsInline
                                      />
                                    ) : (
                                      <img
                                        key={`${item.clientId}-existing-${mediaIndex}`}
                                        src={media.url}
                                        className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                                        alt=""
                                      />
                                    )
                                  )}
                                </div>
                              </>
                            )}

                            {!!item.imagePreviews.length && (
                              <>
                                <p className={helperTextCls}>Yeni eklenecekler</p>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                  {item.imagePreviews.map((url, mediaIndex) =>
                                    toMediaType(item.imagesFiles[mediaIndex]) ===
                                    "video" ? (
                                      <video
                                        key={`${item.clientId}-new-${mediaIndex}`}
                                        src={url}
                                        className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                                        muted
                                        playsInline
                                      />
                                    ) : (
                                      <img
                                        key={`${item.clientId}-new-${mediaIndex}`}
                                        src={url}
                                        className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                                        alt=""
                                      />
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!!mediaError && (
          <div className="rounded-xl border border-red-200/80 bg-red-50/80 p-3 text-sm text-red-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
            {mediaError}
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="btn-admin-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kapak (Dikey image veya video)
            {isEdit ? " — mevcut varsa opsiyonel" : " — zorunlu"}
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleCoverChange}
            className={fileCls}
          />
          <p className={helperTextCls}>
            Öneri: 9:16 (ör. 1080×1920). Minimum en-boy oranı{" "}
            {FRONT_VERTICAL_MIN_RATIO}:1.
          </p>
          <div className="admin-preview-surface mt-3 overflow-hidden">
            {coverPreview ? (
              toMediaType(coverFile) === "video" ? (
                <VideoPreview
                  src={coverPreview}
                  className="aspect-[9/16] w-full object-cover"
                />
              ) : (
                <ImagePreview
                  src={coverPreview}
                  className="aspect-[9/16] w-full object-cover"
                />
              )
            ) : existingCover?.url ? (
              existingCoverIsVideo ? (
                <VideoPreview
                  src={existingCover.url}
                  className="aspect-[9/16] w-full object-cover"
                />
              ) : (
                <ImagePreview
                  src={existingCover.url}
                  className="aspect-[9/16] w-full object-cover"
                />
              )
            ) : (
              <div className="grid aspect-[9/16] place-items-center text-xs text-slate-400 dark:text-slate-500">
                Önizleme
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Alt Medya (opsiyonel, çoklu — image/video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleImagesChange}
            className={fileCls}
          />

          {!!existingImages.length && (
            <>
              <p className={helperTextCls}>
                Mevcut medya (yeniler eklenir, mevcutlar korunur)
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {existingImages.map((media, index) =>
                  media.resourceType === "video" ? (
                    <video
                      key={`existing-top-${index}`}
                      src={media.url}
                      className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      key={`existing-top-${index}`}
                      src={media.url}
                      className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                      alt=""
                    />
                  )
                )}
              </div>
            </>
          )}

          {!!imagesPreviews.length && (
            <>
              <p className={helperTextCls}>Yeni eklenecekler</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {imagesPreviews.map((url, index) =>
                  toMediaType(imagesFiles[index]) === "video" ? (
                    <video
                      key={`new-top-${index}`}
                      src={url}
                      className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      key={`new-top-${index}`}
                      src={url}
                      className="h-20 w-full rounded-2xl object-cover border border-slate-200/70 dark:border-slate-700"
                      alt=""
                    />
                  )
                )}
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
    subServices: PropTypes.arrayOf(
      PropTypes.shape({
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
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default ServiceForm;
