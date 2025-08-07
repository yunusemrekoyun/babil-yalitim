// backend/routes/searchRoutes.js
const express = require("express");
const router = express.Router();

const Blog = require("../models/blog");
const Journal = require("../models/journal");
const Project = require("../models/project");
const Service = require("../models/service");

router.get("/", async (req, res) => {
  const query = req.query.q || "";
  const regex = new RegExp(query, "i");

  try {
    const [blogs, journals, projects, services] = await Promise.all([
      Blog.find({ title: regex }).limit(5).lean(),
      Journal.find({ title: regex }).limit(5).lean(),
      Project.find({ title: regex }).limit(5).lean(),
      Service.find({ title: regex }).limit(5).lean(),
    ]);

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