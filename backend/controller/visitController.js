// backend/controller/visitController.js
const Visit = require("../models/Visit");

const recordVisit = async (req, res) => {
  try {
    const { path } = req.body;
    const ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const visit = new Visit({ path, ip, userAgent });
    await visit.save();

    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: "Ziyaret kaydedilemedi", error });
  }
};

const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find().sort({ createdAt: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: "Ziyaretler getirilemedi", error });
  }
};

const getVisitCountByPath = async (req, res) => {
  try {
    const path = `/${req.params.path}`; // Örn: blog → /blog
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