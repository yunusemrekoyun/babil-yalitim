// backend/models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Blog başlığı
  summary: { type: String, required: true },     // Detay sayfasında üstte görünen kısa özet
  about: { type: String, required: true },       // Detay sayfasında altta görünen uzun açıklama
  image: { type: String, required: true },       // Görsel URL'si
  date: { type: String, required: true },        // Yayın tarihi (string olarak veriyoruz)
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);