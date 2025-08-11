// models/Journal.js
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // Cloudinary secure_url
    publicId: { type: String, required: true }, // Cloudinary public_id
    resourceType: { type: String, default: "image" }, // image | video
  },
  { _id: false }
);

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    // medya
    cover: { type: mediaSchema, required: true }, // zorunlu
    assets: { type: [mediaSchema], default: [] }, // opsiyonel (image/video çoklu)

    // beğeniler
    likesCount: { type: Number, default: 0 },
    likedEmailHashes: { type: [String], default: [] }, // e‑posta SHA-256 hash (saltlı)
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Journal || mongoose.model("Journal", journalSchema);
