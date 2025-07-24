const express = require("express");
const router = express.Router();

const blogRoutes = require("./blogRoutes");
// const journalRoutes = require("./journalRoutes");
// const projectRoutes = require("./projectRoutes");
// const serviceRoutes = require("./serviceRoutes");

router.use("/blogs", blogRoutes);
// router.use("/journals", journalRoutes);
// router.use("/projects", projectRoutes);
// router.use("/services", serviceRoutes);

module.exports = router;