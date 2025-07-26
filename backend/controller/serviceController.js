const Service = require("../models/Service");

// ➕ Tüm Servisleri Getir
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Servisler alınamadı", error: err.message });
  }
};

// 🔍 Tek Servisi Getir
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Servis bulunamadı" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Servis alınamadı", error: err.message });
  }
};

// ➕ Yeni Servis Oluştur
const createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Servis eklenemedi", error: err.message });
  }
};

// ✏️ Servis Güncelle
const updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Servis bulunamadı" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Servis güncellenemedi", error: err.message });
  }
};

// ❌ Servis Sil
const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Servis bulunamadı" });
    res.json({ message: "Servis silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silme işlemi başarısız", error: err.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};