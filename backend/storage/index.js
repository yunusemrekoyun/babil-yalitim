const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
const sharp = require("sharp");
const {
  probeMedia,
  generateVideoPoster,
  remuxVideoForStreaming,
  transcodeVideoVariant,
} = require("../utils/ffmpeg");

const MEDIA_ROOT = path.resolve(
  process.env.MEDIA_ROOT || path.join(__dirname, "..", "media")
);
const MEDIA_PUBLIC_PATH = `/${String(
  process.env.MEDIA_PUBLIC_PATH || "media"
).replace(/^\/+|\/+$/g, "")}`;

const normalizeBaseUrl = (value = "") => String(value || "").replace(/\/+$/g, "");

const buildDefaultBaseUrl = () => {
  const baseUrl = normalizeBaseUrl(process.env.BASE_URL || "");
  if (!baseUrl) return "";
  return `${baseUrl}${MEDIA_PUBLIC_PATH}`;
};

const MEDIA_BASE_URL = normalizeBaseUrl(
  process.env.MEDIA_BASE_URL || buildDefaultBaseUrl()
);
const IMAGE_VARIANT_WIDTHS = String(
  process.env.MEDIA_IMAGE_VARIANT_WIDTHS || "480,960,1600"
)
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(
    (value, index, list) =>
      Number.isFinite(value) && value > 0 && list.indexOf(value) === index
  )
  .sort((a, b) => a - b);
const IMAGE_VARIANT_QUALITY = Number(
  process.env.MEDIA_IMAGE_VARIANT_QUALITY || 82
);
const VIDEO_PREVIEW_MAX_EDGE = Number(
  process.env.MEDIA_VIDEO_PREVIEW_MAX_EDGE || 960
);
const VIDEO_DETAIL_MAX_EDGE = Number(
  process.env.MEDIA_VIDEO_DETAIL_MAX_EDGE || 1440
);
const VIDEO_PREVIEW_CRF = Number(
  process.env.MEDIA_VIDEO_PREVIEW_CRF || 28
);
const VIDEO_DETAIL_CRF = Number(
  process.env.MEDIA_VIDEO_DETAIL_CRF || 23
);
const VIDEO_PREVIEW_WITH_AUDIO = /^(1|true|yes)$/i.test(
  String(process.env.MEDIA_VIDEO_PREVIEW_WITH_AUDIO || "0")
);
const VIDEO_AUDIO_BITRATE = String(
  process.env.MEDIA_VIDEO_AUDIO_BITRATE || "128k"
).trim();

const normalizePathPart = (value = "") =>
  String(value || "")
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part && part !== "." && part !== "..")
    .join("/");

const inferTypeFromFile = (file, forceType) => {
  if (forceType === "image" || forceType === "video") return forceType;
  return /^video\//i.test(file?.mimetype || "") ? "video" : "image";
};

const inferExtension = (file, resourceType) => {
  const originalExt = path.extname(file?.originalname || file?.path || "").toLowerCase();
  if (originalExt) return originalExt;
  if (resourceType === "video") return ".mp4";
  return ".jpg";
};

const encodeStorageKey = (storageKey = "") =>
  normalizePathPart(storageKey)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const buildMediaUrl = (storageKey = "") => {
  const encoded = encodeStorageKey(storageKey);
  if (!encoded) return "";
  if (MEDIA_BASE_URL) {
    return `${MEDIA_BASE_URL}/${encoded}`;
  }
  return `${MEDIA_PUBLIC_PATH}/${encoded}`;
};

const getImageVariantStorageKey = (storageKey = "", width, format = "webp") => {
  const normalized = normalizePathPart(storageKey);
  if (!normalized || !width) return "";
  const parsed = path.posix.parse(normalized);
  return path.posix.join(parsed.dir, `${parsed.name}.w${width}.${format}`);
};

const resolveAbsolutePath = (storageKey = "") =>
  path.join(MEDIA_ROOT, ...normalizePathPart(storageKey).split("/"));

const ensureDir = async (absoluteFilePath) => {
  await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
};

const safeUnlink = async (absoluteFilePath) => {
  if (!absoluteFilePath) return;
  await fs.unlink(absoluteFilePath).catch(() => {});
};

const moveOrWriteFile = async (file, absoluteFilePath) => {
  await ensureDir(absoluteFilePath);

  if (file?.buffer) {
    await fs.writeFile(absoluteFilePath, file.buffer);
    return;
  }

  if (!file?.path) {
    throw new Error("Yükleme için geçerli bir medya dosyası bulunamadı.");
  }

  try {
    await fs.rename(file.path, absoluteFilePath);
  } catch (error) {
    if (error?.code !== "EXDEV") {
      throw error;
    }

    await fs.copyFile(file.path, absoluteFilePath);
    await fs.unlink(file.path).catch(() => {});
  }
};

const getPosterStorageKey = (storageKey = "") => {
  const normalized = normalizePathPart(storageKey);
  if (!normalized) return "";
  const parsed = path.posix.parse(normalized);
  return path.posix.join(parsed.dir, `${parsed.name}.poster.jpg`);
};

const getVideoVariantStorageKey = (storageKey = "", label, format = "mp4") => {
  const normalized = normalizePathPart(storageKey);
  if (!normalized || !label) return "";
  const parsed = path.posix.parse(normalized);
  return path.posix.join(parsed.dir, `${parsed.name}.${label}.${format}`);
};

const prepareVideoForDelivery = async (absoluteFilePath) => {
  const extension = path.extname(absoluteFilePath || "").toLowerCase();
  if (![".mp4", ".mov"].includes(extension)) {
    return false;
  }

  const tempOutputPath = `${absoluteFilePath}.faststart${extension}`;

  try {
    await remuxVideoForStreaming(absoluteFilePath, tempOutputPath, {
      faststart: true,
    });
    await safeUnlink(absoluteFilePath);
    await fs.rename(tempOutputPath, absoluteFilePath);
    return true;
  } catch {
    await safeUnlink(tempOutputPath);
    return false;
  }
};

const extractVideoMeta = async (absoluteFilePath) => {
  const probe = await probeMedia(absoluteFilePath);
  const stream =
    (probe.streams || []).find((item) => item.codec_type === "video") || {};
  const format = probe.format || {};

  return {
    width: Number(stream.width) || undefined,
    height: Number(stream.height) || undefined,
    duration:
      Number(stream.duration) || Number(format.duration) || undefined,
    format:
      String(
        stream.codec_name ||
          format.format_name ||
          path.extname(absoluteFilePath).replace(/^\./, "")
      ).split(",")[0] || undefined,
  };
};

const getVideoScaleSize = ({ width, height, maxEdge }) => {
  const safeWidth = Number(width) || 0;
  const safeHeight = Number(height) || 0;
  const safeMaxEdge = Number(maxEdge) || 0;

  if (!safeWidth || !safeHeight || !safeMaxEdge) return "";
  if (Math.max(safeWidth, safeHeight) <= safeMaxEdge) return "";

  return safeWidth >= safeHeight ? `${safeMaxEdge}x?` : `?x${safeMaxEdge}`;
};

const buildImageDoc = async (absoluteFilePath, storageKey) => {
  const metadata = await sharp(absoluteFilePath).metadata();
  const stat = await fs.stat(absoluteFilePath);
  const variants = await buildImageVariants(absoluteFilePath, storageKey, metadata);

  return {
    url: buildMediaUrl(storageKey),
    storageKey,
    posterUrl: "",
    resourceType: "image",
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    bytes: stat.size,
    duration: undefined,
    variants,
  };
};

const buildVideoVariants = async (absoluteFilePath, storageKey, metadata = {}) => {
  const width = Number(metadata.width) || 0;
  const height = Number(metadata.height) || 0;
  if (!width || !height) return [];

  const plans = [
    {
      label: "preview",
      maxEdge: VIDEO_PREVIEW_MAX_EDGE,
      crf: VIDEO_PREVIEW_CRF,
      includeAudio: VIDEO_PREVIEW_WITH_AUDIO,
    },
    {
      label: "detail",
      maxEdge: VIDEO_DETAIL_MAX_EDGE,
      crf: VIDEO_DETAIL_CRF,
      includeAudio: true,
    },
  ].filter((plan) => Number(plan.maxEdge) > 0);

  const variants = [];
  const createdVariantPaths = [];

  try {
    for (const plan of plans) {
      const size = getVideoScaleSize({
        width,
        height,
        maxEdge: plan.maxEdge,
      });
      if (!size) continue;

      const variantStorageKey = getVideoVariantStorageKey(storageKey, plan.label);
      const absoluteVariantPath = resolveAbsolutePath(variantStorageKey);

      await ensureDir(absoluteVariantPath);
      await transcodeVideoVariant(absoluteFilePath, absoluteVariantPath, {
        size,
        crf: plan.crf,
        includeAudio: plan.includeAudio,
        audioBitrate: VIDEO_AUDIO_BITRATE,
      });
      createdVariantPaths.push(absoluteVariantPath);

      const variantMeta = await extractVideoMeta(absoluteVariantPath);
      const stat = await fs.stat(absoluteVariantPath);

      variants.push({
        label: plan.label,
        url: buildMediaUrl(variantStorageKey),
        storageKey: variantStorageKey,
        format: "mp4",
        width: variantMeta.width,
        height: variantMeta.height,
        bytes: stat.size,
      });
    }
  } catch (error) {
    await Promise.all(createdVariantPaths.map((targetPath) => safeUnlink(targetPath)));
    throw error;
  }

  return variants.sort((a, b) => (a.width || 0) - (b.width || 0));
};

const buildVideoDoc = async (absoluteFilePath, storageKey) => {
  await prepareVideoForDelivery(absoluteFilePath);
  const stat = await fs.stat(absoluteFilePath);
  const metadata = await extractVideoMeta(absoluteFilePath);
  const variants = await buildVideoVariants(absoluteFilePath, storageKey, metadata);
  const posterStorageKey = getPosterStorageKey(storageKey);
  const absolutePosterPath = resolveAbsolutePath(posterStorageKey);
  let posterCreated = false;

  try {
    await ensureDir(absolutePosterPath);
    await generateVideoPoster(absoluteFilePath, absolutePosterPath);
    posterCreated = true;
  } catch {
    await fs.unlink(absolutePosterPath).catch(() => {});
  }

  return {
    url: buildMediaUrl(storageKey),
    storageKey,
    posterUrl: posterCreated ? buildMediaUrl(posterStorageKey) : "",
    resourceType: "video",
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    bytes: stat.size,
    duration: metadata.duration,
    variants,
  };
};

const buildImageVariants = async (absoluteFilePath, storageKey, metadata = {}) => {
  const originalWidth = Number(metadata.width) || 0;
  const originalHeight = Number(metadata.height) || 0;
  const isAnimated = Number(metadata.pages || 0) > 1;

  if (!originalWidth || !originalHeight || isAnimated) {
    return [];
  }

  const widths = IMAGE_VARIANT_WIDTHS.filter((width) => width < originalWidth);
  if (!widths.length) {
    return [];
  }

  const variants = [];
  const createdVariantPaths = [];

  try {
    for (const width of widths) {
      const variantStorageKey = getImageVariantStorageKey(storageKey, width, "webp");
      const absoluteVariantPath = resolveAbsolutePath(variantStorageKey);

      await ensureDir(absoluteVariantPath);
      await sharp(absoluteFilePath, {
        animated: false,
        limitInputPixels: false,
      })
        .rotate()
        .resize({
          width,
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp({
          quality: IMAGE_VARIANT_QUALITY,
          effort: 4,
        })
        .toFile(absoluteVariantPath);

      createdVariantPaths.push(absoluteVariantPath);

      const variantMeta = await sharp(absoluteVariantPath).metadata();
      const stat = await fs.stat(absoluteVariantPath);

      variants.push({
        label: `w${width}`,
        url: buildMediaUrl(variantStorageKey),
        storageKey: variantStorageKey,
        format: variantMeta.format || "webp",
        width: variantMeta.width,
        height: variantMeta.height,
        bytes: stat.size,
      });
    }
  } catch (error) {
    await Promise.all(createdVariantPaths.map((targetPath) => safeUnlink(targetPath)));
    throw error;
  }

  return variants;
};

const upload = async (file, { folder = "uploads", resourceType = "auto" } = {}) => {
  const normalizedFolder = normalizePathPart(folder);
  const detectedType = inferTypeFromFile(file, resourceType);
  const extension = inferExtension(file, detectedType);
  const storageKey = [normalizedFolder, `${Date.now()}-${randomUUID()}${extension}`]
    .filter(Boolean)
    .join("/");
  const absoluteFilePath = resolveAbsolutePath(storageKey);

  try {
    await moveOrWriteFile(file, absoluteFilePath);

    if (detectedType === "video") {
      return await buildVideoDoc(absoluteFilePath, storageKey);
    }

    return await buildImageDoc(absoluteFilePath, storageKey);
  } catch (error) {
    await fs.unlink(absoluteFilePath).catch(() => {});
    const posterStorageKey = getPosterStorageKey(storageKey);
    if (posterStorageKey) {
      await fs.unlink(resolveAbsolutePath(posterStorageKey)).catch(() => {});
    }
    throw error;
  }
};

const getMediaKey = (media = {}) => normalizePathPart(media?.storageKey || "");

const destroy = async (media) => {
  const storageKey = getMediaKey(media);
  if (!storageKey) return;

  const targets = [storageKey];
  if ((media?.resourceType || "image") === "video") {
    targets.push(getPosterStorageKey(storageKey));
  }
  if (Array.isArray(media?.variants)) {
    media.variants.forEach((variant) => {
      const key = normalizePathPart(variant?.storageKey || "");
      if (key) targets.push(key);
    });
  }

  await Promise.all(
    targets
      .filter(Boolean)
      .map((key) => fs.unlink(resolveAbsolutePath(key)).catch(() => {}))
  );
};

const refreshMediaDoc = async (media) => {
  const normalizedMedia = media?.toObject?.() || media;
  const storageKey = getMediaKey(normalizedMedia);
  if (!storageKey) return normalizedMedia || null;

  const absoluteFilePath = resolveAbsolutePath(storageKey);
  const resourceType = normalizedMedia?.resourceType || "image";

  if (resourceType === "video") {
    return buildVideoDoc(absoluteFilePath, storageKey);
  }

  return buildImageDoc(absoluteFilePath, storageKey);
};

module.exports = {
  MEDIA_ROOT,
  MEDIA_PUBLIC_PATH,
  MEDIA_BASE_URL,
  buildMediaUrl,
  getMediaKey,
  getImageVariantStorageKey,
  getPosterStorageKey,
  refreshMediaDoc,
  upload,
  destroy,
};
