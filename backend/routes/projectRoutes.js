const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadMedia");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

// public
router.get("/", getProjects);
router.get("/:id", getProjectById);

// protected (multipart)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 }, // zorunlu
    { name: "video", maxCount: 1 }, // opsiyonel
    { name: "images", maxCount: 4 }, // opsiyonel
  ]),
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
  updateProject
);

router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
