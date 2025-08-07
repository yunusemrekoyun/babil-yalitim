// models/Journal.js

const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: String,
  about: String,
  image: String,
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.models.Journal || mongoose.model("Journal", journalSchema);