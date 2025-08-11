const cloudinary = require("cloudinary").v2;

// Eğer CLOUDINARY_URL varsa (tek satır), SDK otomatik okur.
// Ayrı key'lerle geliyorsa, aşağıda config devreye girer.
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

module.exports = cloudinary;
