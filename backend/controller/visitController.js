const Visit = require("../models/Visit");

// Yeni ziyaret kaydı oluştur
const recordVisit = async (req, res) => {
  try {
    const { path } = req.body;
    const visit = new Visit({ path });
    await visit.save();
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: "Ziyaret kaydedilemedi", error });
  }
};

// Tüm ziyaretleri getir
const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find().sort({ createdAt: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: "Ziyaretler getirilemedi", error });
  }
};

// Belirli bir path için ziyaret sayısı getir
const getVisitCountByPath = async (req, res) => {
  try {
    const path = req.params.path;
    const count = await Visit.countDocuments({ path });
    res.json({ path, count });
  } catch (error) {
    res.status(500).json({ message: "Ziyaret sayısı alınamadı", error });
  }
};

module.exports = {
  recordVisit,
  getAllVisits,
  getVisitCountByPath,
};