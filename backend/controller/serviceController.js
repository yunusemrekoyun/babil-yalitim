// backend/controller/serviceController.js
const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary"); // projedeki ortak config'i kullan

/* ---------- helpers ---------- */

// '["a","b"]' | "a,b" | ["a","b"] -> ["a","b"]
const normalizeAreas = (val) => {
  if (Array.isArray(val))
    return val
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } catch {
      /* JSON değilse CSV sanırız */
    }
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// Buffer'ı Cloudinary'e yükle
const uploadFromBuffer = async (file, folder) => {
  const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: "image",
    overwrite: true,
    unique_filename: true,
    use_filename: true,
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
  };
};

/* ---------- GET ---------- */
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Servisler alınamadı", error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Servis bulunamadı" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Servis alınamadı", error: err.message });
  }
};

/* ---------- CREATE ---------- */
// fields (text): title, type, category, usageAreas, description
// files: cover(1, required), images(multi, optional)
const createService = async (req, res) => {
  try {
    const { title, type, category, description } = req.body;
    const usageAreas = normalizeAreas(req.body.usageAreas);

    const coverFile = req.files?.cover?.[0];
    if (!coverFile) {
      return res.status(400).json({ message: "Kapak görseli zorunludur." });
    }

    const folder = process.env.CLOUDINARY_SERVICES_FOLDER || "services";
    const cover = await uploadFromBuffer(coverFile, folder);

    let images = [];
    if (Array.isArray(req.files?.images) && req.files.images.length) {
      images = await Promise.all(
        req.files.images.map((f) => uploadFromBuffer(f, `${folder}/gallery`))
      );
    }

    const created = await Service.create({
      title,
      type,
      category,
      usageAreas,
      description,
      cover,
      images,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Servis eklenemedi", error: err.message });
  }
};

/* ---------- UPDATE ---------- */
// cover gönderilirse REPLACE; images gönderilirse EKLE
const updateService = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Servis bulunamadı" });

    const { title, type, category, description } = req.body;

    if (title !== undefined) svc.title = title;
    if (type !== undefined) svc.type = type;
    if (category !== undefined) svc.category = category;
    if (description !== undefined) svc.description = description;
    if (req.body.usageAreas !== undefined) {
      svc.usageAreas = normalizeAreas(req.body.usageAreas);
    }

    const folder = process.env.CLOUDINARY_SERVICES_FOLDER || "services";

    // Kapak REPLACE
    if (req.files?.cover?.[0]) {
      if (svc.cover?.publicId) {
        try {
          await cloudinary.uploader.destroy(svc.cover.publicId, {
            resource_type: "image",
          });
        } catch {
          /* sessiz geç */
        }
      }
      svc.cover = await uploadFromBuffer(req.files.cover[0], folder);
    }

    // Alt görseller EKLE
    if (Array.isArray(req.files?.images) && req.files.images.length) {
      const uploaded = await Promise.all(
        req.files.images.map((f) => uploadFromBuffer(f, `${folder}/gallery`))
      );
      svc.images = [...(svc.images || []), ...uploaded];
    }

    const saved = await svc.save();
    res.json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Servis güncellenemedi", error: err.message });
  }
};

/* ---------- DELETE ---------- */
const deleteService = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Servis bulunamadı" });

    const destroyOne = async (media) => {
      if (!media?.publicId) return;
      try {
        await cloudinary.uploader.destroy(media.publicId, {
          resource_type: media.resourceType || "image",
        });
      } catch {
        /* sessiz geç */
      }
    };

    await destroyOne(svc.cover);
    if (Array.isArray(svc.images)) {
      await Promise.all(svc.images.map(destroyOne));
    }

    await svc.deleteOne();
    res.json({ message: "Servis silindi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Silme işlemi başarısız", error: err.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
