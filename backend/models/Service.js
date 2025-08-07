const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);