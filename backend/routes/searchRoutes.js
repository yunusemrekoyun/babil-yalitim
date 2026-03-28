// backend/routes/searchRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// ✅ Linux case-sensitive: model dosya adları büyük harfle
const Blog = require("../models/Blog");
const Journal = require("../models/Journal");
const Project = require("../models/Project");
const Service = require("../models/Service");
const {
  buildMongoTokenQuery,
  buildExcerpt,
  normalizeSearchQuery,
  scoreSearchDocument,
} = require("../utils/search");

const searchLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", searchLimiter, async (req, res) => {
  const query = normalizeSearchQuery(req.query.q || "");
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 40);

  if (query.length < 2) {
    return res.json([]);
  }

  try {
    const [blogs, journals, projects, services] = await Promise.all([
      Blog.find(buildMongoTokenQuery(["title", "content", "tags"], query) || {})
        .select("_id title content tags createdAt updatedAt")
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(80)
        .lean(),
      Journal.find(buildMongoTokenQuery(["title", "content"], query) || {})
        .select("_id title content createdAt updatedAt")
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(80)
        .lean(),
      Project.find(
        buildMongoTokenQuery(["title", "description", "category"], query) || {}
      )
        .select("_id title description category createdAt updatedAt")
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(80)
        .lean(),
      Service.find(
        buildMongoTokenQuery(
          [
            "title",
            "type",
            "category",
            "usageAreas",
            "description",
            "subServices.title",
            "subServices.type",
            "subServices.category",
            "subServices.usageAreas",
            "subServices.description",
          ],
          query
        ) || {}
      )
        .select(
          "_id title type category usageAreas description subServices createdAt updatedAt"
        )
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(80)
        .lean(),
    ]);

    const staticPages = [
      {
        _id: "static-about",
        type: "about",
        title: "Hakkımızda",
        path: "/about",
        content:
          "Babil Yalıtım; su yalıtımı, yapı koruma, poliüretan köpük, poliürea, epoksi zemin kaplama ve beton silim alanlarında modern teknolojiyle kalıcı çözümler sunar.",
        keywords: [
          "kurumsal",
          "babil",
          "su yalıtımı",
          "yapı koruma",
          "poliürea",
          "epoksi",
        ],
      },
      {
        _id: "static-whyus",
        type: "whyus",
        title: "Neden Biz",
        path: "/whyus",
        content:
          "Neden Babil Yalıtım tercih edilmeli, uzmanlık, uygulama kalitesi ve güven yaklaşımı.",
        keywords: ["neden biz", "güven", "kalite", "uzmanlık", "tecrübe"],
      },
      {
        _id: "static-contact",
        type: "contact",
        title: "İletişim",
        path: "/iletisim",
        content:
          "Telefon, e-posta, adres, keşif talebi ve iletişim bilgileri sayfası.",
        keywords: ["iletişim", "telefon", "adres", "mail", "keşif"],
      },
      {
        _id: "static-kvkk",
        type: "kvkk",
        title: "KVKK",
        path: "/kvkk",
        content:
          "Kişisel verilerin korunması ve aydınlatma metni bilgileri.",
        keywords: ["kvkk", "gizlilik", "kişisel veri"],
      },
    ];

    const scoredBlogs = blogs
      .map((item) => {
        const { score, matchedFields } = scoreSearchDocument(
          [
            { value: item.title, weight: 16, label: "Başlık" },
            { value: item.tags, weight: 11, label: "Etiket" },
            { value: item.content, weight: 5, label: "İçerik" },
          ],
          query
        );

        return {
          ...item,
          type: "blog",
          path: `/blog/${item._id}`,
          excerpt: buildExcerpt(item.content || item.tags?.join(", "), query),
          matchedFields,
          score,
        };
      })
      .filter((item) => item.score > 0);

    const scoredJournals = journals
      .map((item) => {
        const { score, matchedFields } = scoreSearchDocument(
          [
            { value: item.title, weight: 16, label: "Başlık" },
            { value: item.content, weight: 6, label: "İçerik" },
          ],
          query
        );

        return {
          ...item,
          type: "journal",
          path: `/journals/${item._id}`,
          excerpt: buildExcerpt(item.content, query),
          matchedFields,
          score,
        };
      })
      .filter((item) => item.score > 0);

    const scoredProjects = projects
      .map((item) => {
        const { score, matchedFields } = scoreSearchDocument(
          [
            { value: item.title, weight: 16, label: "Başlık" },
            { value: item.category, weight: 11, label: "Kategori" },
            { value: item.description, weight: 7, label: "Açıklama" },
          ],
          query
        );

        return {
          ...item,
          type: "project",
          path: `/project-detail/${item._id}`,
          excerpt: buildExcerpt(
            [item.category, item.description].filter(Boolean).join(" • "),
            query
          ),
          matchedFields,
          score,
        };
      })
      .filter((item) => item.score > 0);

    const scoredServices = services
      .map((item) => {
        const subServiceTitles = (item.subServices || []).map((sub) => sub.title);
        const subServiceCategories = (item.subServices || []).map(
          (sub) => sub.category
        );
        const subServiceDescriptions = (item.subServices || []).map(
          (sub) => sub.description
        );
        const subServiceAreas = (item.subServices || []).flatMap(
          (sub) => sub.usageAreas || []
        );

        const { score, matchedFields } = scoreSearchDocument(
          [
            { value: item.title, weight: 16, label: "Başlık" },
            { value: item.type, weight: 12, label: "Tür" },
            { value: item.category, weight: 11, label: "Kategori" },
            { value: item.usageAreas, weight: 9, label: "Kullanım Alanı" },
            { value: item.description, weight: 7, label: "Açıklama" },
            { value: subServiceTitles, weight: 12, label: "Alt Hizmet" },
            {
              value: subServiceCategories,
              weight: 8,
              label: "Alt Hizmet Kategorisi",
            },
            { value: subServiceAreas, weight: 8, label: "Alt Hizmet Alanı" },
            {
              value: subServiceDescriptions,
              weight: 5,
              label: "Alt Hizmet Açıklaması",
            },
          ],
          query
        );

        return {
          ...item,
          type: "service",
          path: `/services/${item._id}`,
          excerpt: buildExcerpt(
            [
              item.type,
              item.category,
              item.description,
              ...subServiceTitles,
            ]
              .filter(Boolean)
              .join(" • "),
            query
          ),
          matchedFields,
          score,
        };
      })
      .filter((item) => item.score > 0);

    const scoredStaticPages = staticPages
      .map((item) => {
        const { score, matchedFields } = scoreSearchDocument(
          [
            { value: item.title, weight: 18, label: "Sayfa" },
            { value: item.keywords, weight: 10, label: "Anahtar Kelime" },
            { value: item.content, weight: 5, label: "İçerik" },
          ],
          query
        );

        return {
          ...item,
          excerpt: buildExcerpt(
            [item.content, ...(item.keywords || [])].join(" • "),
            query
          ),
          matchedFields,
          score,
        };
      })
      .filter((item) => item.score > 0);

    const results = [
      ...scoredBlogs,
      ...scoredJournals,
      ...scoredProjects,
      ...scoredServices,
      ...scoredStaticPages,
    ]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
        const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
        return bDate - aDate;
      })
      .slice(0, limit)
      .map((item) => ({
        _id: item._id,
        title: item.title,
        type: item.type,
        path: item.path,
        excerpt: item.excerpt,
        matchedFields: item.matchedFields,
        score: item.score,
      }));

    res.json(results);
  } catch (err) {
    console.error("Arama hatası:", err);
    res.status(500).json({ message: "Arama işlemi sırasında hata oluştu" });
  }
});

module.exports = router;
