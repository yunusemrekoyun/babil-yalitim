// backend/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload"); // memoryStorage + image filter

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

// protected + multipart
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 20 },
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
