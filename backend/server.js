// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // 🆕 CORS eklendi
const connectDB = require("./config/db");
const mainRoutes = require("./routes/index");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS AYARI (Frontend'den gelen isteklere izin veriyoruz)
app.use(cors({
  origin: "http://localhost:5173", // frontend portu
  credentials: true, // eğer cookie veya auth varsa
}));

app.use(express.json());

// ✅ API route
app.use("/api", mainRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
});