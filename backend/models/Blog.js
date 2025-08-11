const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // Cloudinary secure_url
    publicId: { type: String, required: true }, // Cloudinary public_id
    resourceType: { type: String, enum: ["image", "video"], required: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    duration: Number, // video ise sn
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true, _id: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // zengin metin/plain
    tags: { type: [String], default: [] }, // opsiyonel
    cover: { type: mediaSchema, required: true }, // zorunlu kapak (image)
    assets: { type: [mediaSchema], default: [] }, // opsiyonel: image/video (çoklu)
    comments: { type: [commentSchema], default: [] }, // gömülü yorumlar
  },
  { timestamps: true }
);

module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
