import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_DESCRIPTION, SITE_TITLE } from "../../config/site";
import { buildPageMeta } from "../../utils/seo";

function ensureMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }
  return element;
}

function ensureCanonical() {
  let link = document.head.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  return link;
}

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const meta = buildPageMeta(location.pathname, origin);

    document.title = meta.title || SITE_TITLE;

    const description = ensureMeta("meta[name='description']", {
      name: "description",
    });
    description.setAttribute("content", meta.description || SITE_DESCRIPTION);

    const ogTitle = ensureMeta("meta[property='og:title']", {
      property: "og:title",
    });
    ogTitle.setAttribute("content", meta.title || SITE_TITLE);

    const ogDescription = ensureMeta("meta[property='og:description']", {
      property: "og:description",
    });
    ogDescription.setAttribute(
      "content",
      meta.description || SITE_DESCRIPTION
    );

    const ogUrl = ensureMeta("meta[property='og:url']", {
      property: "og:url",
    });
    ogUrl.setAttribute("content", meta.canonical);

    const twitterTitle = ensureMeta("meta[name='twitter:title']", {
      name: "twitter:title",
    });
    twitterTitle.setAttribute("content", meta.title || SITE_TITLE);

    const twitterDescription = ensureMeta("meta[name='twitter:description']", {
      name: "twitter:description",
    });
    twitterDescription.setAttribute(
      "content",
      meta.description || SITE_DESCRIPTION
    );

    ensureCanonical().setAttribute("href", meta.canonical);
  }, [location.pathname]);

  return null;
}
