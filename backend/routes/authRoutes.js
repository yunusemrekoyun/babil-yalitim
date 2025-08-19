// backend/routes/authRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, me, logout } = require("../controller/authController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
router.get("/me", verifyToken, me);
router.post("/logout", verifyToken, logout);

module.exports = router;
