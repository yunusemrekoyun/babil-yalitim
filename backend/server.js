// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", true);

/* ---------- CORS ---------- */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.BASE_URL;
const EXTRA_ALLOWED = (process.env.EXTRA_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowPreview = process.env.VERCEL_PREVIEW_ALLOWED === "1";

const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  const whitelist = new Set(
    [FRONTEND_ORIGIN, ...EXTRA_ALLOWED].filter(Boolean)
  );
  if (whitelist.has(origin)) return true;
  if (allowPreview && /\.vercel\.app$/i.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // non-browser istekleri
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // cookie için şart
  })
);

/* ---------- Parsers & Security ---------- */
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser()); // httpOnly cookie’leri okuyabilmek için
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

/* ---------- Health & API ---------- */
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", require("./routes/index"));

/* ---------- 404 & Error ---------- */
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Not Found" });
  }
  next();
});

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const payload =
    process.env.NODE_ENV === "production"
      ? { message: err.message || "Internal Server Error" }
      : { message: err.message || "Internal Server Error", stack: err.stack };
  res.status(status).json(payload);
});

/* ---------- Listen ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
  console.log(`🌐 CORS primary origin: ${FRONTEND_ORIGIN || "∅"}`);
  if (EXTRA_ALLOWED.length)
    console.log(`➕ Extra origins: ${EXTRA_ALLOWED.join(", ")}`);
  console.log(
    `🧪 Vercel previews allowed: ${allowPreview ? "YES (*.vercel.app)" : "NO"}`
  );
});
