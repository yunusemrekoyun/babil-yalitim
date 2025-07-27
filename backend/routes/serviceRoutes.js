// backend/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controller/serviceController");

// herkese açık
router.get("/", getServices);
router.get("/:id", getServiceById);

// korumalı
router.post("/", verifyToken, createService);
router.put("/:id", verifyToken, updateService);
router.delete("/:id", verifyToken, deleteService);

module.exports = router;
