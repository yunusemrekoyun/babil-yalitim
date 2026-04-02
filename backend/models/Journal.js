// models/Journal.js
const mongoose = require("mongoose");
const mediaSchema = require("./schemas/mediaSchema");

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    displayOrder: { type: Number, default: 1, min: 1 },
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
