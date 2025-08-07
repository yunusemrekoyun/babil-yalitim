// backend/routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const {
  recordVisit,
  getAllVisits,
  getVisitCountByPath,
} = require("../controller/visitController");

// ✅ Token kontrolü kaldırıldı!
router.post("/", recordVisit);
router.get("/", getAllVisits);
router.get("/count/:path", getVisitCountByPath);

module.exports = router;