// backend/routes/searchRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Linux case-sensitive: model dosya adları büyük harfle
const Blog = require("../models/Blog");
const Journal = require("../models/Journal");
const Project = require("../models/Project");
const Service = require("../models/Service");

router.get("/", async (req, res) => {
  const query = (req.query.q || "").trim();
  const regex = new RegExp(query, "i");

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