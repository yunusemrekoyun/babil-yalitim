// backend/routes/authRoutes.js
const express = require("express");
const { login } = require("../controller/authController");
const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

module.exports = router;
