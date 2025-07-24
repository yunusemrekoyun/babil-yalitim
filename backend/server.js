// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mainRoutes = require("./routes/index");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Route'lar
app.use("/api", mainRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});