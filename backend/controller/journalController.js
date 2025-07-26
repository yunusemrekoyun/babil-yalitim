// controllers/journalController.js

const Journal = require("../models/Journal");

// GET /api/journal
const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find().sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/journal/:id
const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: "Journal bulunamadı" });
    res.json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/journal
const createJournal = async (req, res) => {
  try {
    const newJournal = new Journal(req.body);
    const saved = await newJournal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/journal/:id
const updateJournal = async (req, res) => {
  try {
    const updated = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/journal/:id
const deleteJournal = async (req, res) => {
  try {
    const deleted = await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Silindi", deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
};