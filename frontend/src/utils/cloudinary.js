const FALLBACK_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQwJyBoZWlnaHQ9JzM2MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJy8+PC9zdmc+";

const ENV_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

export const looksVideo = (url = "") =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(url));

export const extractCloudinaryAsset = (url = "") => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("res.cloudinary.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    const cloudName = parts[0];
    const resourceType = parts[1];
    const uploadIdx = parts.findIndex((part) => part === "upload");

    if (!cloudName || !resourceType || uploadIdx === -1) return null;

    const trailing = parts.slice(uploadIdx + 1);

    const isTransformSegment = (segment = "") =>
      segment.includes(",") || /^[a-z]{1,3}_[^/]+/i.test(segment);

    let startIdx = 0;
    while (
      startIdx < trailing.length - 1 &&
      isTransformSegment(trailing[startIdx]) &&
      !/^v\d+$/i.test(trailing[startIdx])
    ) {
      startIdx += 1;
    }

    if (/^v\d+$/i.test(trailing[startIdx])) {
      startIdx += 1;
    }

    const publicParts = trailing.slice(startIdx);
    const publicId = publicParts
      .join("/")
      .replace(/\.[a-z0-9]+$/i, "")
      .trim();

    if (!publicId) return null;

    return { cloudName, publicId, resourceType };
  } catch {
    return null;
  }
};

const resolveAsset = (resource, fallbackType = "image") => {
  if (!resource) return null;

  if (typeof resource === "string") {
    const extracted = extractCloudinaryAsset(resource);
    if (!extracted) return null;
    return extracted;
  }

  if (resource.publicId) {
    return {
      cloudName: ENV_CLOUD,
      publicId: resource.publicId,
      resourceType: resource.resourceType || fallbackType,
    };
  }

  return extractCloudinaryAsset(resource.url || "");
};

const buildUrl = ({ cloudName, resourceType, publicId, transforms = [] }) => {
  if (!cloudName || !resourceType || !publicId) return "";

  const transformPath = transforms.filter(Boolean).join(",");
  const encodedId = publicId
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformPath}/${encodedId}`;
};

export const getOptimizedImageUrl = (
  resource,
  {
    width,
    height,
    crop = "fill",
    quality = "auto:good",
    gravity = "auto",
    fallbackSrc = FALLBACK_SVG,
  } = {}
) => {
  const asset = resolveAsset(resource, "image");
  if (!asset) {
    if (typeof resource === "string") return resource || fallbackSrc;
    return resource?.url || fallbackSrc;
  }

  if (typeof resource === "string" && asset.resourceType === "video") {
    return resource || fallbackSrc;
  }

  const transforms = ["f_auto", "dpr_auto", `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`, `g_${gravity}`);

  return buildUrl({ ...asset, resourceType: "image", transforms });
};

export const getImageSrcSet = (
  resource,
  {
    widths = [320, 480, 640, 800, 960, 1280],
    quality = "auto:good",
    crop = "fill",
    gravity = "auto",
  } = {}
) => {
  const asset = resolveAsset(resource, "image");
  if (!asset || asset.resourceType === "video") return undefined;

  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(asset, {
        width,
        crop,
        gravity,
        quality,
      });
      return `${url} ${width}w`;
    })
    .join(", ");
};

export const getOptimizedVideoUrl = (
  resource,
  { width, quality = "auto:good", stripAudio = true } = {}
) => {
  const asset = resolveAsset(resource, "video");
  if (!asset) {
    if (typeof resource === "string") return resource || "";
    return resource?.url || "";
  }

  const transforms = ["f_auto:video", "vc_auto", `q_${quality}`];
  if (stripAudio) transforms.push("ac_none");
  if (width) transforms.push(`w_${width}`, "c_limit");

  return buildUrl({ ...asset, resourceType: "video", transforms });
};

export const getVideoPosterUrl = (
  resource,
  { width, quality = "auto:good", offset = 0 } = {}
) => {
  const asset = resolveAsset(resource, "video");
  if (!asset) return FALLBACK_SVG;

  const transforms = [`so_${offset}`, "f_auto", `q_${quality}`];
  if (width) transforms.push(`w_${width}`, "c_limit");

  return buildUrl({ ...asset, resourceType: "video", transforms });
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
    quality = "auto:good",
    fallbackSrc = FALLBACK_SVG,
  } = {}
) => ({
  src: getOptimizedImageUrl(resource, {
    width,
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
