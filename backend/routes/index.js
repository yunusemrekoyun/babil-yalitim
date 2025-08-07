///Applications/Works/tailwind-react-babil/backend/routes/index.js
const express = require("express");
const router = express.Router();

const blogRoutes = require("./blogRoutes");
const journalRoutes = require("./journalRoutes");
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./serviceRoutes");
const visitRoutes = require("./visitRoutes"); // 🔧 düzeltildi



router.use("/blogs", blogRoutes);
router.use("/journals", journalRoutes);
router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/visits", visitRoutes); // 

module.exports = router;
