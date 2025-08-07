// backend/models/Visit.js
const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    ip: String,
    path: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Visit || mongoose.model("Visit", visitSchema);