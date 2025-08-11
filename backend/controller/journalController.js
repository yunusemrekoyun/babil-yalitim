// controller/journalController.js
const crypto = require("crypto");
const Journal = require("../models/Journal");
const cloudinary = require("../config/cloudinary");

// ---- helpers ----
const toMediaDoc = (cldRes) => ({
  url: cldRes.secure_url,
  publicId: cldRes.public_id,
  resourceType: cldRes.resource_type || "image",
});

const uploadOne = async (file, folder) => {
  const opts = { folder, resource_type: "auto", overwrite: true };
  let res;
  if (file?.buffer && file?.mimetype) {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    res = await cloudinary.uploader.upload(dataUri, opts);
  } else if (file?.path) {
    res = await cloudinary.uploader.upload(file.path, opts);
  } else {
    throw new Error("Yükleme için geçersiz dosya");
  }
  return toMediaDoc(res);
};

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

const emailToHash = (emailRaw) => {
  const email = String(emailRaw || "")
    .trim()
    .toLowerCase();
  const salt = process.env.LIKE_SALT || "journal-like-salt";
  return crypto
    .createHash("sha256")
    .update(salt + "|" + email)
    .digest("hex");
};

// ---- CRUD ----
exports.getJournals = async (req, res) => {
  try {
    const items = await Journal.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Haberler alınamadı", error: err.message });
  }
};

exports.getJournalById = async (req, res) => {
  try {
    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Haber alınamadı", error: err.message });
  }
};

// fields: title, content
// files: cover(1, required image), assets(multi, optional image|video)
exports.createJournal = async (req, res) => {
  try {
    const { title, content } = req.body;
    const files = req.files || {};
    const coverFile = files.cover?.[0];
    if (!coverFile)
      return res.status(400).json({ message: "Kapak görseli zorunludur" });

    const folder = process.env.CLOUDINARY_JOURNAL_FOLDER || "babil/journals";

    const cover = await uploadOne(coverFile, folder);

    let assets = [];
    if (Array.isArray(files.assets) && files.assets.length) {
      assets = await Promise.all(files.assets.map((f) => uploadOne(f, folder)));
    }

    const created = await Journal.create({
      title,
      content,
      cover,
      assets,
    });

    res.status(201).json(created);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Haber eklenemedi",
        error: err?.message || String(err),
      });
  }
};

// text update + cover replace + assets append
exports.updateJournal = async (req, res) => {
  try {
    const { title, content } = req.body;
    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    const files = req.files || {};
    const folder = process.env.CLOUDINARY_JOURNAL_FOLDER || "babil/journals";

    if (title !== undefined) item.title = title;
    if (content !== undefined) item.content = content;

    if (files.cover?.[0]) {
      await destroyIfExists(item.cover);
      item.cover = await uploadOne(files.cover[0], folder);
    }

    if (Array.isArray(files.assets) && files.assets.length) {
      const appended = await Promise.all(
        files.assets.map((f) => uploadOne(f, folder))
      );
      item.assets = [...(item.assets || []), ...appended];
    }

    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Haber güncellenemedi",
        error: err?.message || String(err),
      });
  }
};

// delete all media + doc
exports.deleteJournal = async (req, res) => {
  try {
    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    await destroyIfExists(item.cover);
    if (Array.isArray(item.assets)) {
      await Promise.all(item.assets.map(destroyIfExists));
    }

    await item.deleteOne();
    res.json({ message: "Haber silindi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Silme başarısız", error: err?.message || String(err) });
  }
};

// tek bir asset sil (opsiyonel, admin için kullanışlı)
exports.deleteAsset = async (req, res) => {
  try {
    const { id, publicId } = req.params;
    const item = await Journal.findById(id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    const idx = (item.assets || []).findIndex((a) => a.publicId === publicId);
    if (idx === -1)
      return res.status(404).json({ message: "Medya bulunamadı" });

    await destroyIfExists(item.assets[idx]);
    item.assets.splice(idx, 1);
    await item.save();

    res.json({ message: "Medya silindi", assets: item.assets });
  } catch (err) {
    res.status(400).json({ message: "Medya silinemedi", error: err.message });
  }
};

// ---- Likes ----
// Body: { email }
// Aynı e‑posta ile birden fazla beğeni engellenir (hash karşılaştırması)
exports.likeJournal = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !/^\S+@\S+\.\S+$/.test(String(email))) {
      return res.status(400).json({ message: "Geçerli bir e‑posta gerekli" });
    }

    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    const h = emailToHash(email);
    if (item.likedEmailHashes.includes(h)) {
      return res.status(409).json({
        message: "Bu haber zaten beğenilmiş",
        likesCount: item.likesCount,
        liked: true,
      });
    }

    item.likedEmailHashes.push(h);
    item.likesCount = (item.likesCount || 0) + 1;
    await item.save();

    res.json({
      message: "Beğenildi",
      likesCount: item.likesCount,
      liked: true,
    });
  } catch (err) {
    res.status(400).json({ message: "Beğeni eklenemedi", error: err.message });
  }
};

// sadece sayısı
exports.getLikesCount = async (req, res) => {
  try {
    const item = await Journal.findById(req.params.id).select("likesCount");
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });
    res.json({ likesCount: item.likesCount || 0 });
  } catch (err) {
    res.status(500).json({ message: "Likes alınamadı", error: err.message });
  }
};
