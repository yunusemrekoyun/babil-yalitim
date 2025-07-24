const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: String,
  about: String,
  image: String,
  date: {
    type: String,
    default: new Date().toLocaleDateString("tr-TR"),
  },
});

module.exports = mongoose.model("Blog", blogSchema);