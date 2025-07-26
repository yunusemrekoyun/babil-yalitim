const express = require("express");
const router = express.Router();
const {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
} = require("../controller/journalController"); // ✅ klasör ismi düzeltildi

// Tüm journal'ları getir
router.get("/", getJournals);

// Tek journal'ı getir
router.get("/:id", getJournalById);

// Yeni journal oluştur
router.post("/", createJournal);

// Güncelle
router.put("/:id", updateJournal);

// Sil
router.delete("/:id", deleteJournal);

module.exports = router;