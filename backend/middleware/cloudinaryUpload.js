import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// 📌 Görsel Yükleme
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "firma-site-images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }], // optimize
  },
});
export const uploadImage = multer({ storage: imageStorage });

// 📌 Video Yükleme
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "firma-site-videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
  },
});
export const uploadVideo = multer({ storage: videoStorage });
