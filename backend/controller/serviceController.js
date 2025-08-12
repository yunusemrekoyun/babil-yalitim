// backend/controller/serviceController.js
const fs = require("fs/promises");
const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");

/* -------------------- helpers -------------------- */

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
      /* JSON değilse CSV say */
    }
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// En-boy oranı doğrulaması (ör. dikey ~9:16 için 1.5)
// .env -> VERTICAL_MIN_RATIO=1.5
const VERTICAL_MIN_RATIO = Number(process.env.VERTICAL_MIN_RATIO || 1.5);

const assertPortrait = (meta, where = "kapak") => {
  const w = Number(meta?.width || 0);
  const h = Number(meta?.height || 0);
  if (!w || !h) return; // meta yoksa zorlamayalım (özellikle bazı video durumları)
  const ratio = h / w;
  if (h < w || ratio < VERTICAL_MIN_RATIO) {
    const err = new Error(
      `Lütfen ${where} için dikey bir medya yükleyin (en-boy oranı en az ${VERTICAL_MIN_RATIO}:1).`
    );
    err.status = 400;
    throw err;
  }
};

// Tek dosya yükleme (image|video). Hem memoryStorage hem diskStorage ile çalışır.
const uploadOne = async (file, folder) => {
  const options = {
    folder,
    resource_type: "auto", // image | video
    overwrite: true,
    unique_filename: true,
    use_filename: true,
  };

  let res;
  if (file?.buffer && file?.mimetype) {
    // memoryStorage
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    res = await cloudinary.uploader.upload(dataUri, options);
  } else if (file?.path) {
    // diskStorage
    try {
      res = await cloudinary.uploader.upload(file.path, options);
    } finally {
      try {
        await fs.unlink(file.path);
      } catch {
        /* yut */
      }
    }
  } else {
    throw new Error("Geçersiz dosya");
  }

  return {
    url: res.secure_url || res.url,
    publicId: res.public_id,
    resourceType: res.resource_type || "image",
    width: res.width,
    height: res.height,
    duration: res.duration,
    format: res.format,
  };
};

// Cloudinary'den sil
const destroyIfExists = async (media) => {
  if (!media?.publicId) return;
  try {
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.resourceType || "image",
    });
  } catch {
    /* sessiz geç */
  }
};

/* -------------------- GET -------------------- */
const getServices = async (_req, res) => {
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

/* -------------------- CREATE -------------------- */
// fields (text): title, type, category, usageAreas, description
// files: cover(1, required image|video), images(multi, optional image|video)
const createService = async (req, res) => {
  try {
    const { title, type, category, description } = req.body;
    const usageAreas = normalizeAreas(req.body.usageAreas);

    const coverFile = req.files?.cover?.[0];
    if (!coverFile) {
      return res.status(400).json({ message: "Kapak zorunludur." });
    }

    const folder = process.env.CLOUDINARY_SERVICES_FOLDER || "services";

    // Kapak yükle + DIKEY doğrulaması
    const cover = await uploadOne(coverFile, folder);
    assertPortrait(cover, "kapak");

    // Galeri (opsiyonel) — image|video karışık
    let images = [];
    if (Array.isArray(req.files?.images) && req.files.images.length) {
      images = await Promise.all(
        req.files.images.map((f) => uploadOne(f, `${folder}/gallery`))
      );
      // Eğer galeriye de dikey zorunluluğu istiyorsan bu satırı aç:
      // images.forEach((m) => assertPortrait(m, "galeri"));
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
    res
      .status(err.status || 400)
      .json({ message: err.message || "Servis eklenemedi" });
  }
};

/* -------------------- UPDATE -------------------- */
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
      const uploaded = await uploadOne(req.files.cover[0], folder);
      try {
        assertPortrait(uploaded, "kapak");
      } catch (e) {
        // yeni yüklenen uygun değilse hemen temizle
        await destroyIfExists(uploaded);
        throw e;
      }
      // eskisini sil ve değiştir
      await destroyIfExists(svc.cover);
      svc.cover = uploaded;
    }

    // Galeriye ekle
    if (Array.isArray(req.files?.images) && req.files.images.length) {
      const appended = await Promise.all(
        req.files.images.map((f) => uploadOne(f, `${folder}/gallery`))
      );
      // appended.forEach((m) => assertPortrait(m, "galeri")); // istersen aç
      svc.images = [...(svc.images || []), ...appended];
    }

    const saved = await svc.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message || "Servis güncellenemedi" });
  }
};

/* -------------------- DELETE -------------------- */
const deleteService = async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: "Servis bulunamadı" });

    await destroyIfExists(svc.cover);
    if (Array.isArray(svc.images)) {
      await Promise.all(svc.images.map(destroyIfExists));
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
