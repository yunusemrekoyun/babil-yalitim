const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadMedia"); // disk tmp, image+video kabul eder

const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteAsset,
  // comments
  getApprovedComments,
  createComment,
  getAllComments,
  setCommentApproval,
  deleteComment,
} = require("../controller/blogController");

/* -------- public -------- */
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// public comments
router.get("/:id/comments", getApprovedComments);
router.post("/:id/comments", createComment);

/* -------- protected (admin) -------- */
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 }, // zorunlu (image)
    { name: "assets", maxCount: 30 }, // opsiyonel (image|video karışık)
  ]),
  createBlog
);

router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "assets", maxCount: 30 },
  ]),
  updateBlog
);

router.delete("/:id", verifyToken, deleteBlog);

// tek asset silme (publicId ile)
router.delete("/:id/assets/:publicId", verifyToken, deleteAsset);

// admin: comment moderation
router.get("/:id/comments/all", verifyToken, getAllComments);
router.patch(
  "/:id/comments/:commentId/approve",
  verifyToken,
  setCommentApproval
);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);

module.exports = router;
