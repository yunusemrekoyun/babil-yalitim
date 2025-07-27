// backend/routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken"); // ← ekledik
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");

// GET tüm bloglar (herkese açık)
router.get("/", getAllBlogs);

// GET tek blog (herkese açık)
router.get("/:id", getBlogById);

// POST yeni blog (korumalı)
router.post("/", verifyToken, createBlog);

// PUT blog güncelle (korumalı)
router.put("/:id", verifyToken, updateBlog);

// DELETE blog sil (korumalı)
router.delete("/:id", verifyToken, deleteBlog);

module.exports = router;
