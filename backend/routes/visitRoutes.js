const express = require("express");
const {
  recordVisit,
  getAllVisits,
  getVisitCountByPath,
} = require("../controller/visitController");

const router = express.Router();

// Yeni bir ziyaret kaydı
router.post("/", recordVisit);

// Tüm ziyaretleri al
router.get("/", getAllVisits);

// Belirli bir path için ziyaret sayısı
router.get("/count/:path", getVisitCountByPath);

module.exports = router;