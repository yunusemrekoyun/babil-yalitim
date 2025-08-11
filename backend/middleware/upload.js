// backend/middleware/upload.js
const multer = require("multer");

//  - RAM'e al (diskte tmp yok) → sharp ile işleyeceğiz
const storage = multer.memoryStorage();

//  - Güvenlik: sadece görseller, boyut sınırı
const MAX_FILE_SIZE_MB = Number(process.env.MAX_IMAGE_SIZE_MB || 8); // 8MB
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|webp)/.test(file.mimetype);
    if (!ok)
      return cb(new Error("Sadece JPEG/PNG/WEBP dosyaları yüklenebilir"));
    cb(null, true);
  },
});

module.exports = upload;
