const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);