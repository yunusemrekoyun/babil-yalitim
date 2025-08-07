// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
app.use(express.json());

// 🔓 Herkese açık rotalar
app.use("/api/search", searchRoutes);
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/journals", require("./routes/journalRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/auth", require("./routes/authRoutes")); // login/register

// 🛡️ Artık global verifyToken kaldırıldı

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
});