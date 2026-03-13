const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeLineBreaks = (value = "") =>
  String(value).replace(/\r\n?/g, "\n").trim();

export const getYouTubeEmbedUrl = (input = "") => {
  const value = String(input || "").trim();
  if (!value) return "";

  const iframeMatch = value.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  const candidate = iframeMatch?.[1] || value;

  try {
    const url = new URL(candidate);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.replace(/\//g, "").trim();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
      }

      const shortsMatch = url.pathname.match(/^\/shorts\/([^/?#]+)/i);
      if (shortsMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`;
      }

      const embedMatch = url.pathname.match(/^\/embed\/([^/?#]+)/i);
      if (embedMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
      }
    }

    if (host === "youtube-nocookie.com") {
      const embedMatch = url.pathname.match(/^\/embed\/([^/?#]+)/i);
      if (embedMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
      }
    }
  } catch {
    return "";
  }

  return "";
};

export const isUrlOnlyBlock = (block = "") =>
  /^https?:\/\/[^\s<>"']+$/i.test(String(block).trim());

const buildIframe = (embedUrl) =>
  `<iframe src="${embedUrl}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

export const buildRichContentHtml = (input = "") => {
  const source = normalizeLineBreaks(input);
  if (!source) return "";

  const blocks = source
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const embedUrl = getYouTubeEmbedUrl(block);
      if (embedUrl) return buildIframe(embedUrl);

      if (isUrlOnlyBlock(block)) {
        const safeUrl = escapeHtml(block);
        return `<p><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a></p>`;
      }

      if (/<\/?[a-z][\s\S]*>/i.test(block)) {
        return block;
      }

      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
};
