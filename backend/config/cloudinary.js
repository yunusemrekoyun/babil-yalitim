// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;

// Eğer CLOUDINARY_URL set edildiyse otomatik okunur.
// Ayrı key'ler geldiyse manuel config yap.
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

module.exports = cloudinary;
