// backend/routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  recordVisit,
  getAllVisits,
  getVisitCountByPath,
} = require("../controller/visitController");

// Yeni bir ziyaret kaydı (korumalı)
router.post("/", verifyToken, recordVisit);

// Tüm ziyaretleri al (korumalı)
router.get("/", verifyToken, getAllVisits);

// Belirli bir path için ziyaret sayısı (korumalı)
router.get("/count/:path", verifyToken, getVisitCountByPath);

module.exports = router;
