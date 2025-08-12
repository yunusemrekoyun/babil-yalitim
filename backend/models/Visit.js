// backend/models/Visit.js
const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ip: String,
    country: { type: String, index: true },
    city: String,
    path: { type: String, index: true },
    referrer: String,
    userAgent: String,
    browser: String,
    os: String,
    device: { type: String, default: "desktop", index: true },
    duration: { type: Number, default: 0 }, // saniye
    scrollDepth: { type: Number, default: 0 }, // %
    section: { type: String, index: true },
  },
  { timestamps: true }
);

// Zaman bazlı raporlar için createdAt index'i
visitSchema.index({ createdAt: -1 });
// En sık yapılan rapor kombinasyonları:
visitSchema.index({ section: 1, createdAt: -1 });
visitSchema.index({ path: 1, createdAt: -1 });

module.exports = mongoose.models.Visit || mongoose.model("Visit", visitSchema);
