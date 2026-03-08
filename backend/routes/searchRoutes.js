// backend/routes/searchRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// ✅ Linux case-sensitive: model dosya adları büyük harfle
const Blog = require("../models/Blog");
const Journal = require("../models/Journal");
const Project = require("../models/Project");
const Service = require("../models/Service");
const { buildSearchRegex, normalizeSearchQuery } = require("../utils/search");

const searchLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", searchLimiter, async (req, res) => {
  const query = normalizeSearchQuery(req.query.q || "");
  const regex = buildSearchRegex(query);

  if (!regex) {
    return res.json([]);
  }

  try {
    const [blogs, journals, projects, services] = await Promise.all([
      Blog.find({ title: regex }).select("_id title").limit(5).lean(),
      Journal.find({ title: regex }).select("_id title").limit(5).lean(),
      Project.find({ title: regex }).select("_id title").limit(5).lean(),
      Service.find({ title: regex }).select("_id title").limit(5).lean(),
    ]);

    // 🔁 Mevcut response yapını korudum (tek array + type alanı)
    res.json([
      ...blogs.map((item) => ({ ...item, type: "blog" })),
      ...journals.map((item) => ({ ...item, type: "journal" })),
      ...projects.map((item) => ({ ...item, type: "project" })),
      ...services.map((item) => ({ ...item, type: "service" })),
    ]);
  } catch (err) {
    console.error("Arama hatası:", err);
    res.status(500).json({ message: "Arama işlemi sırasında hata oluştu" });
  }
});

module.exports = router;
