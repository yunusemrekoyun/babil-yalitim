const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "video"], required: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    duration: Number,
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    displayOrder: { type: Number, default: 1, min: 1 },
    description: String,
    category: String,

    cover: { type: mediaSchema, required: true },
    video: { type: mediaSchema },
    images: { type: [mediaSchema], default: [] },

    // 🆕 Tarih alanları (opsiyonel)
    startDate: { type: Date },
    endDate: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    return next(new Error("Bitiş tarihi, başlangıç tarihinden önce olamaz."));
  }
  next();
});

projectSchema.virtual("durationDays").get(function () {
  if (this.startDate && this.endDate) {
    const ms = this.endDate - this.startDate;
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }
});

projectSchema.index({ completedAt: -1 });

module.exports =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
