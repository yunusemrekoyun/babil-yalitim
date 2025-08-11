const os = require("os");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ""));
  },
});

// Kapak zorunlu (image|video), ayrıca opsiyonel video ve max 4 görsel
const MAX_IMG_MB = Number(process.env.MAX_IMAGE_SIZE_MB || 10);
const MAX_VID_MB = Number(process.env.MAX_VIDEO_SIZE_MB || 200);

const upload = multer({
  storage,
  // En yüksek sınırı uygula (video büyük olabilir)
  limits: { fileSize: MAX_VID_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImage = /^image\/(jpe?g|png|webp|gif|avif)$/i.test(file.mimetype);
    const isVideo = /^video\/(mp4|quicktime|x-matroska|webm|x-msvideo)$/i.test(
      file.mimetype
    );
    if (!isImage && !isVideo) {
      return cb(new Error("Sadece resim veya video yükleyebilirsiniz."));
    }
    cb(null, true);
  },
});

module.exports = upload;
