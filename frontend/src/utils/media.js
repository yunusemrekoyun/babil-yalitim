const FALLBACK_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

const normalizeBaseUrl = (value = "") =>
  String(value || "")
    .trim()
    .replace(/\/+$/g, "");

const deriveMediaOrigin = () => {
  const apiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || "");
  if (apiBase) {
    return apiBase.replace(/\/api$/i, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

const MEDIA_ORIGIN = deriveMediaOrigin();

const absolutizeMediaUrl = (value = "") => {
  const url = String(value || "").trim();
  if (!url) return "";

  if (/^(?:data:|blob:|https?:\/\/|\/\/)/i.test(url)) {
    return url;
  }

  if (!MEDIA_ORIGIN) return url;

  try {
    return new URL(url, `${MEDIA_ORIGIN}/`).toString();
  } catch {
    return url;
  }
};

export const looksVideo = (url = "") =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(url));

export const resolveMedia = (resource, fallbackType = "image") => {
  if (!resource) return null;

  if (typeof resource === "string") {
    const url = absolutizeMediaUrl(resource);
    if (!url) return null;
    return {
      url,
      resourceType: looksVideo(url) ? "video" : fallbackType,
      posterUrl: "",
      storageKey: "",
    };
  }

  const url = absolutizeMediaUrl(resource.url || resource.src || "");
  if (!url) return null;

  return {
    ...resource,
    url,
    posterUrl: absolutizeMediaUrl(
      resource.posterUrl || resource.poster_url || ""
    ),
    storageKey: String(resource.storageKey || "").trim(),
    resourceType:
      resource.resourceType ||
      resource.resource_type ||
      (looksVideo(url) ? "video" : fallbackType),
  };
};

export const getMediaKey = (resource) => {
  const media = resolveMedia(resource);
  return media?.storageKey || media?.url || "";
};

export const getMediaUrl = (resource, fallback = "") =>
  resolveMedia(resource)?.url || fallback;

export const getOptimizedImageUrl = (
  resource,
  { fallbackSrc = FALLBACK_SVG } = {}
) => {
  const media = resolveMedia(resource, "image");
  if (!media) {
    if (typeof resource === "string") return resource || fallbackSrc;
    return resource?.url || fallbackSrc;
  }

  if (media.resourceType === "video") {
    return media.posterUrl || fallbackSrc;
  }

  return media.url || fallbackSrc;
};

export const getImageSrcSet = () => undefined;

export const getOptimizedVideoUrl = (resource) => {
  const media = resolveMedia(resource, "video");
  if (!media) {
    if (typeof resource === "string") return resource || "";
    return resource?.url || "";
  }

  return media.resourceType === "video" ? media.url || "" : "";
};

export const getVideoPosterUrl = (
  resource,
  { fallbackSrc = FALLBACK_SVG } = {}
) => {
  const media = resolveMedia(resource, "video");
  if (!media) return fallbackSrc;

  if (media.resourceType !== "video") {
    return media.url || fallbackSrc;
  }

  return media.posterUrl || fallbackSrc;
};

export const getResponsiveImageProps = (
  resource,
  {
    width,
    widths,
    height,
    sizes = "100vw",
    crop,
    gravity,
    quality,
    fallbackSrc = FALLBACK_SVG,
  } = {}
) => ({
  src: getOptimizedImageUrl(resource, {
    width,
    widths,
    height,
    crop,
    gravity,
    quality,
    fallbackSrc,
  }),
  srcSet: getImageSrcSet(resource, { widths, crop, gravity, quality }),
  sizes,
});

export { FALLBACK_SVG };
