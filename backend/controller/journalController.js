// controller/journalController.js
const crypto = require("crypto");
const Journal = require("../models/Journal");
const mediaStorage = require("../storage");
const sanitizeHtml = require("../utils/sanitizeHtml");
const { buildRichContentHtml } = require("../utils/richContent");
const {
  parseDisplayOrder,
  syncCollectionDisplayOrder,
} = require("../utils/displayOrder");
const {
  parseMediaOrder,
  reorderMediaCollection,
} = require("../utils/mediaOrder");

// ---- helpers ----
const uploadOne = async (file, folder) => mediaStorage.upload(file, { folder });

const destroyIfExists = async (media) => mediaStorage.destroy(media);

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
    await syncCollectionDisplayOrder(Journal);
    const items = await Journal.find().sort({ displayOrder: 1, createdAt: 1, _id: 1 });
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
    const requestedOrder = parseDisplayOrder(req.body.displayOrder);
    const files = req.files || {};
    const coverFile = files.cover?.[0];
    if (!coverFile)
      return res.status(400).json({ message: "Kapak görseli zorunludur" });

    const folder = process.env.MEDIA_JOURNALS_FOLDER || "journals";

    const cover = await uploadOne(coverFile, folder);

    let assets = [];
    if (Array.isArray(files.assets) && files.assets.length) {
      const uploadedAssets = await Promise.all(
        files.assets.map((f) => uploadOne(f, folder))
      );
      assets = await reorderMediaCollection({
        existing: [],
        uploaded: uploadedAssets,
        order: parseMediaOrder(req.body.assetOrder),
        destroy: destroyIfExists,
      });
    }

    const created = await Journal.create({
      title,
      ...(requestedOrder ? { displayOrder: requestedOrder } : {}),
      content: content ? sanitizeHtml(buildRichContentHtml(content)) : content,
      cover,
      assets,
    });

    await syncCollectionDisplayOrder(Journal, created._id, requestedOrder);
    const refreshed = await Journal.findById(created._id);

    res.status(201).json(refreshed);
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
    const requestedOrder = parseDisplayOrder(req.body.displayOrder);
    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    const files = req.files || {};
    const folder = process.env.MEDIA_JOURNALS_FOLDER || "journals";
    const assetOrder = parseMediaOrder(req.body.assetOrder);

    if (title !== undefined) item.title = title;
    if (requestedOrder) item.displayOrder = requestedOrder;
    if (content !== undefined) {
      item.content = content
        ? sanitizeHtml(buildRichContentHtml(content))
        : content;
    }

    if (files.cover?.[0]) {
      await destroyIfExists(item.cover);
      item.cover = await uploadOne(files.cover[0], folder);
    }

    if (Array.isArray(files.assets) && files.assets.length) {
      const uploadedAssets = await Promise.all(
        files.assets.map((f) => uploadOne(f, folder))
      );
      item.assets = await reorderMediaCollection({
        existing: item.assets || [],
        uploaded: uploadedAssets,
        order: assetOrder,
        destroy: destroyIfExists,
      });
    } else if (assetOrder.length) {
      item.assets = await reorderMediaCollection({
        existing: item.assets || [],
        uploaded: [],
        order: assetOrder,
        destroy: destroyIfExists,
      });
    }

    const saved = await item.save();
    await syncCollectionDisplayOrder(
      Journal,
      saved._id,
      requestedOrder || saved.displayOrder
    );
    const refreshed = await Journal.findById(saved._id);
    res.json(refreshed);
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
    await syncCollectionDisplayOrder(Journal);
    res.json({ message: "Haber silindi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Silme başarısız", error: err?.message || String(err) });
  }
};

exports.setJournalOrder = async (req, res) => {
  try {
    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    const requestedOrder = parseDisplayOrder(req.body.displayOrder);
    if (!requestedOrder) {
      return res
        .status(400)
        .json({ message: "Geçerli bir gösterim sırası girin." });
    }

    await syncCollectionDisplayOrder(Journal, item._id, requestedOrder);
    const refreshed = await Journal.findById(item._id);
    res.json({
      message: "Haber sırası güncellendi",
      displayOrder: refreshed?.displayOrder || requestedOrder,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Sıra güncellenemedi", error: err.message });
  }
};

// tek bir asset sil (opsiyonel, admin için kullanışlı)
exports.deleteAsset = async (req, res) => {
  try {
    const { id, mediaKey: mediaKeyParam } = req.params;
    const item = await Journal.findById(id);
    if (!item) return res.status(404).json({ message: "Haber bulunamadı" });

    const requestedKey = decodeURIComponent(String(mediaKeyParam || "").trim());
    const idx = (item.assets || []).findIndex(
      (media) => mediaStorage.getMediaKey(media) === requestedKey
    );
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
