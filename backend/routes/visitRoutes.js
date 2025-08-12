// backend/routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const {
  recordVisit,
  getAllVisits,
  getVisitCountByPath,
  getSummary,
  getTopPages,
  getTimeseries,
} = require("../controller/visitController");

// 🔓 Public (KVKK onayı header’la geldiği sürece kayıt alınıyor)
router.post("/", recordVisit);

// 📊 Raporlar / Listeler (admin panelinden çağıracaksın → burada istersen verifyToken ekleyebilirsin)
router.get("/", getAllVisits);
router.get("/count/:path", getVisitCountByPath);
router.get("/summary", getSummary);
router.get("/top-pages", getTopPages);
router.get("/timeseries", getTimeseries);

module.exports = router;
