const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");

router.get("/", getAllBlogs);           // GET tüm bloglar
router.get("/:id", getBlogById);        // GET tek blog
router.post("/", createBlog);           // POST yeni blog
router.put("/:id", updateBlog);         // PUT blog güncelle
router.delete("/:id", deleteBlog);      // DELETE blog sil

module.exports = router;