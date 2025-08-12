// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Proxy arkasında IP'yi doğru almak için
app.set("trust proxy", true);

// CORS — credentials:true kullanıldığı için '*' kullanma
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.BASE_URL;

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ⚠️ BU SATIRI SİL: Express 5'te '*' path invalid
// app.options("*", cors({ origin: FRONTEND_ORIGIN, credentials: true }));

app.use(express.json());

// Basit health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Tüm rotaları merkezi index.js üzerinden yükle
app.use("/api", require("./routes/index"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
  console.log(`🌐 CORS origin: ${FRONTEND_ORIGIN}`);
});
