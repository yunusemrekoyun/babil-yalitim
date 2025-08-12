// backend/routes/index.js
const express = require("express");
const router = express.Router();

function mount(path, modPath) {
  try {
    console.log("⇒ mount", path, "from", modPath);
    const mod = require(modPath);
    router.use(path, mod);
    console.log("✓ mounted", path);
  } catch (e) {
    console.error("✗ FAILED mounting", path, "from", modPath, "\n", e);
    throw e; // burada durdur; hangisi bozuk net görünsün
  }
}

mount("/search", "./searchRoutes");
mount("/blogs", "./blogRoutes");
mount("/journals", "./journalRoutes");
mount("/projects", "./projectRoutes");
mount("/services", "./serviceRoutes");
mount("/auth", "./authRoutes");
mount("/visits", "./visitRoutes");

module.exports = router;
