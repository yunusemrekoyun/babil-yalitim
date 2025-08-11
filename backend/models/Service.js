// backend/models/Service.js
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // Cloudinary secure_url
    publicId: { type: String, required: true }, // Cloudinary public_id
    resourceType: { type: String, default: "image" }, // image | video (ileriye dönük)
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Hizmet adı
    type: { type: String, default: "" }, // Hizmet türü
    category: { type: String, default: "" }, // Tag/kategori
    usageAreas: { type: [String], default: [] }, // Kullanım alanları (opsiyonel, DİZİ)
    description: { type: String, required: true }, // Açıklama

    cover: { type: mediaSchema, required: true }, // Tek kapak görseli (zorunlu)
    images: { type: [mediaSchema], default: [] }, // Alt görseller (opsiyonel)
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
