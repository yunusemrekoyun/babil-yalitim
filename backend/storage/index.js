const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

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

const resolveAbsolutePath = (storageKey = "") =>
  path.join(MEDIA_ROOT, ...normalizePathPart(storageKey).split("/"));

const ensureDir = async (absoluteFilePath) => {
  await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
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

const probeVideo = (absoluteFilePath) =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(absoluteFilePath, (error, data) => {
      if (error) return reject(error);
      resolve(data || {});
    });
  });

const getPosterStorageKey = (storageKey = "") => {
  const normalized = normalizePathPart(storageKey);
  if (!normalized) return "";
  const parsed = path.posix.parse(normalized);
  return path.posix.join(parsed.dir, `${parsed.name}.poster.jpg`);
};

const generateVideoPoster = (absoluteVideoPath, absolutePosterPath) =>
  new Promise((resolve, reject) => {
    ffmpeg(absoluteVideoPath)
      .outputOptions(["-frames:v 1", "-q:v 2"])
      .output(absolutePosterPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

const extractVideoMeta = async (absoluteFilePath) => {
  const probe = await probeVideo(absoluteFilePath);
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

const buildImageDoc = async (absoluteFilePath, storageKey) => {
  const metadata = await sharp(absoluteFilePath).metadata();
  const stat = await fs.stat(absoluteFilePath);

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
  };
};

const buildVideoDoc = async (absoluteFilePath, storageKey) => {
  const stat = await fs.stat(absoluteFilePath);
  const metadata = await extractVideoMeta(absoluteFilePath);
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
  };
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

  await Promise.all(
    targets
      .filter(Boolean)
      .map((key) => fs.unlink(resolveAbsolutePath(key)).catch(() => {}))
  );
};

module.exports = {
  MEDIA_ROOT,
  MEDIA_PUBLIC_PATH,
  MEDIA_BASE_URL,
  buildMediaUrl,
  getMediaKey,
  getPosterStorageKey,
  upload,
  destroy,
};
