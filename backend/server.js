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

// 🔐 Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🛡️ Protect tüm API rotalarını JWT ile
const verifyToken = require("./middleware/verifyToken");
const mainRoutes = require("./routes/index");
app.use("/api", verifyToken, mainRoutes);

// Eğer istersen sadece write işlemlerini korumak için şöyle ayırabilirsin:
// app.use("/api/blogs", verifyToken, require("./routes/blogRoutes"));
// app.use("/api/journals", verifyToken, require("./routes/journalRoutes"));
// … vs.

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
});
