// backend/routes/journalRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
} = require("../controller/journalController");

// herkese açık
router.get("/", getJournals);
router.get("/:id", getJournalById);

// korumalı
router.post("/", verifyToken, createJournal);
router.put("/:id", verifyToken, updateJournal);
router.delete("/:id", verifyToken, deleteJournal);

module.exports = router;
