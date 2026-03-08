import { SITE_DESCRIPTION, SITE_TITLE } from "../config/site";

const DEFAULT_META = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

const MATCHERS = [
  {
    test: (pathname) => pathname === "/",
    title: `Ana Sayfa | ${SITE_TITLE}`,
    description: SITE_DESCRIPTION,
  },
  {
    test: (pathname) => pathname.startsWith("/services"),
    title: `Hizmetler | ${SITE_TITLE}`,
    description: "Sunulan hizmetler, uygulama alanlari ve detayli cozum sayfalari.",
  },
  {
    test: (pathname) => pathname.startsWith("/projects"),
    title: `Projeler | ${SITE_TITLE}`,
    description: "Tamamlanan projeler ve uygulama detaylari.",
  },
  {
    test: (pathname) => pathname.startsWith("/project-detail"),
    title: `Proje Detayi | ${SITE_TITLE}`,
    description: "Secili proje icin medya, aciklama ve uygulama bilgileri.",
  },
  {
    test: (pathname) => pathname.startsWith("/blog/"),
    title: `Blog Detayi | ${SITE_TITLE}`,
    description: "Teknik icerik ve blog yazisi detay sayfasi.",
  },
  {
    test: (pathname) => pathname === "/blog",
    title: `Blog | ${SITE_TITLE}`,
    description: "Teknik notlar, rehberler ve guncel blog yazilari.",
  },
  {
    test: (pathname) => pathname.startsWith("/journal") || pathname.startsWith("/journals"),
    title: `Haberler | ${SITE_TITLE}`,
    description: "Haberler, duyurular ve saha guncellemeleri.",
  },
  {
    test: (pathname) => pathname === "/about",
    title: `Hakkimizda | ${SITE_TITLE}`,
    description: "Marka, ekip ve calisma yaklasimi hakkinda bilgi.",
  },
  {
    test: (pathname) => pathname === "/whyus",
    title: `Neden Biz | ${SITE_TITLE}`,
    description: "Neden bu ekip ve bu hizmet modeli tercih edilmeli.",
  },
  {
    test: (pathname) => pathname === "/iletisim",
    title: `Iletisim | ${SITE_TITLE}`,
    description: "Iletisim bilgileri ve teklif talep formu.",
  },
  {
    test: (pathname) => pathname === "/kvkk",
    title: `KVKK | ${SITE_TITLE}`,
    description: "KVKK ve gizlilik bilgilendirmesi.",
  },
];

export function buildPageMeta(pathname = "/", origin = "") {
  const normalizedPath = pathname || "/";
  const matched = MATCHERS.find((item) => item.test(normalizedPath)) || DEFAULT_META;
  const safeOrigin =
    origin && /^https?:\/\//i.test(origin) ? origin.replace(/\/+$/, "") : "";

  return {
    title: matched.title || DEFAULT_META.title,
    description: matched.description || DEFAULT_META.description,
    canonical: safeOrigin ? `${safeOrigin}${normalizedPath}` : normalizedPath,
  };
}
