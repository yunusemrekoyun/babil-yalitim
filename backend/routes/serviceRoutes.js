// backend/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
// const upload = require("../middleware/upload"); // eski (sadece image)
// ⇩ yeni: image+video kabul eder (disk veya memory çalışır)
const upload = require("../middleware/uploadMedia");

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controller/serviceController");

// public
router.get("/", getServices);
router.get("/:id", getServiceById);

// protected + multipart (image | video)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 }, // zorunlu, image | video
    { name: "images", maxCount: 20 }, // opsiyonel, image | video
  ]),
  createService
);

router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  updateService
);

router.delete("/:id", verifyToken, deleteService);

module.exports = router;
