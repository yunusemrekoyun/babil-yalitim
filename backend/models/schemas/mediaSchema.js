const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    storageKey: { type: String, required: true },
    posterUrl: { type: String, default: "" },
    resourceType: { type: String, enum: ["image", "video"], required: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    duration: Number,
  },
  { _id: false }
);

module.exports = mediaSchema;
