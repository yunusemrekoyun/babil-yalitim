import { SITE_DESCRIPTION, SITE_TITLE } from "../config/site";
import { getAboutContent } from "../content/aboutContent";
import {
  buildLocaleAlternates,
  localizePath,
  stripLocalePrefix,
} from "../i18n/routing.js";

const getDefaultMeta = (locale) => ({
  title: SITE_TITLE,
  description:
    locale === "en"
      ? "Waterproofing, insulation solutions, projects, blog posts and field updates."
      : SITE_DESCRIPTION,
});

const MATCHERS = [
  {
    test: (pathname) => pathname === "/",
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Home" : "Ana Sayfa"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Insulation services, completed projects, blog posts and company updates."
          : SITE_DESCRIPTION,
    }),
  },
  {
    test: (pathname) => pathname.startsWith("/services"),
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Services" : "Hizmetler"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Service overview, application areas and detailed solution pages."
          : "Sunulan hizmetler, uygulama alanlari ve detayli cozum sayfalari.",
    }),
  },
  {
    test: (pathname) => pathname.startsWith("/projects"),
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Projects" : "Projeler"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Completed projects and application details."
          : "Tamamlanan projeler ve uygulama detaylari.",
    }),
  },
  {
    test: (pathname) => pathname.startsWith("/project-detail"),
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Project Detail" : "Proje Detayi"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Selected project media, description and execution details."
          : "Secili proje icin medya, aciklama ve uygulama bilgileri.",
    }),
  },
  {
    test: (pathname) => pathname.startsWith("/blog/"),
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Blog Detail" : "Blog Detayi"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Technical content and blog post detail page."
          : "Teknik icerik ve blog yazisi detay sayfasi.",
    }),
  },
  {
    test: (pathname) => pathname === "/blog",
    getMeta: (locale) => ({
      title: `Blog | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Technical notes, guides and recent blog posts."
          : "Teknik notlar, rehberler ve guncel blog yazilari.",
    }),
  },
  {
    test: (pathname) => pathname.startsWith("/journal") || pathname.startsWith("/journals"),
    getMeta: (locale) => ({
      title: `${locale === "en" ? "News" : "Haberler"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "News, announcements and field updates."
          : "Haberler, duyurular ve saha guncellemeleri.",
    }),
  },
  {
    test: (pathname) => pathname === "/about",
    getMeta: (locale) => ({
      title: `${locale === "en" ? "About" : "Hakkimizda"} | ${SITE_TITLE}`,
      description: getAboutContent(locale).seoDescription,
    }),
  },
  {
    test: (pathname) => pathname === "/whyus",
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Why Us" : "Neden Biz"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Why this team and service model should be preferred."
          : "Neden bu ekip ve bu hizmet modeli tercih edilmeli.",
    }),
  },
  {
    test: (pathname) => pathname === "/iletisim",
    getMeta: (locale) => ({
      title: `${locale === "en" ? "Contact" : "Iletisim"} | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Contact details and quotation request form."
          : "Iletisim bilgileri ve teklif talep formu.",
    }),
  },
  {
    test: (pathname) => pathname === "/kvkk",
    getMeta: (locale) => ({
      title: `KVKK | ${SITE_TITLE}`,
      description:
        locale === "en"
          ? "Personal data protection and privacy notice."
          : "KVKK ve gizlilik bilgilendirmesi.",
    }),
  },
];

export function buildPageMeta(pathname = "/", origin = "", locale = "tr") {
  const normalizedPath = pathname || "/";
  const basePath = stripLocalePrefix(normalizedPath);
  const matched = MATCHERS.find((item) => item.test(basePath));
  const pageMeta = matched?.getMeta ? matched.getMeta(locale) : getDefaultMeta(locale);
  const safeOrigin =
    origin && /^https?:\/\//i.test(origin) ? origin.replace(/\/+$/, "") : "";
  const canonicalPath = localizePath(basePath, locale);
  const alternates = buildLocaleAlternates(basePath, safeOrigin);

  return {
    title: pageMeta.title || getDefaultMeta(locale).title,
    description: pageMeta.description || getDefaultMeta(locale).description,
    canonical: safeOrigin ? `${safeOrigin}${canonicalPath}` : canonicalPath,
    alternates,
  };
}
