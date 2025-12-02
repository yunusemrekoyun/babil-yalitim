// backend/routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { upload, compressIfNeeded } = require("../middleware/uploadMedia");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectCovers, // ✅ BUNU EKLE
} = require("../controller/projectController");

// 🔹 PUBLIC
router.get("/covers", getProjectCovers); // ✅ DİNAMİK /:id’DEN ÖNCE OLMALI
router.get("/", getProjects);
router.get("/:id", getProjectById);

// 🔹 PROTECTED (multipart)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  compressIfNeeded,
  createProject
);

router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  compressIfNeeded,
  updateProject
);

router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
