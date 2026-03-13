const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ""));
  },
});

// Uygulama limiti: 50MB; daha büyük görselleri sıkıştırmayı dene, videoları reddet
const SOFT_LIMIT_MB = 50;
const SOFT_LIMIT_BYTES = SOFT_LIMIT_MB * 1024 * 1024;
// multer limiti: çok büyük dosya patlatmasın (200MB)
const MULTER_LIMIT_BYTES =
  Number(process.env.MAX_VIDEO_SIZE_MB || 200) * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MULTER_LIMIT_BYTES },
  fileFilter: (_req, file, cb) => {
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

async function compressIfNeeded(req, res, next) {
  const files = req.files || {};
  const all = Array.isArray(files) ? files : Object.values(files).flat();

  const failed = [];

  for (const file of all) {
    if (!file) continue;
    if (file.size <= SOFT_LIMIT_BYTES) continue;

    const isImage = /^image\//i.test(file.mimetype || "");
    const isVideo = /^video\//i.test(file.mimetype || "");

    if (isImage) {
      try {
        const outputPath = file.path + ".webp";
        await sharp(file.path)
          .resize({
            width: 1920,
            height: 1920,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toFile(outputPath);

        const stat = await fs.stat(outputPath);
        await fs.unlink(file.path).catch(() => {});

        // Yeni metadata'yı multer dosya objesine yaz
        file.path = outputPath;
        file.size = stat.size;
        file.filename = path.basename(outputPath);
        file.mimetype = "image/webp";
      } catch (err) {
        failed.push(file.originalname || file.filename || "dosya");
        continue;
      }

      if (file.size > SOFT_LIMIT_BYTES) {
        failed.push(file.originalname || file.filename || "dosya");
      }
      continue;
    }

    if (isVideo) {
      if (!ffmpegPath) {
        failed.push(file.originalname || file.filename || "video");
        continue;
      }
      const outputPath = file.path + "_compressed.mp4";
      try {
        await new Promise((resolve, reject) => {
          ffmpeg(file.path)
            .outputOptions([
              "-vcodec",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "28",
              "-acodec",
              "aac",
              "-b:a",
              "128k",
              "-movflags",
              "+faststart",
              "-vf",
              "scale='min(1280,iw)':-2",
            ])
            .on("end", resolve)
            .on("error", reject)
            .save(outputPath);
        });

        const stat = await fs.stat(outputPath);
        await fs.unlink(file.path).catch(() => {});

        file.path = outputPath;
        file.size = stat.size;
        file.filename = path.basename(outputPath);
        file.mimetype = "video/mp4";

        if (file.size > SOFT_LIMIT_BYTES) {
          failed.push(file.originalname || file.filename || "video");
        }
      } catch (err) {
        await fs.unlink(outputPath).catch(() => {});
        failed.push(file.originalname || file.filename || "video");
      }
      continue;
    }

    failed.push(file.originalname || file.filename || "dosya");
  }

  if (failed.length) {
    return res.status(413).json({
      message:
        "Yüklediğiniz dosya(lar) 50MB limitinin altında olmalı. Sıkıştırmayı denedik ancak hâlâ büyük: " +
        failed.join(", ") +
        ". Lütfen daha küçük veya sıkıştırılmış bir dosya yükleyin.",
    });
  }

  next();
}

module.exports = { upload, compressIfNeeded, SOFT_LIMIT_MB };
