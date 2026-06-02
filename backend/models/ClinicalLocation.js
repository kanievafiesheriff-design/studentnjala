const mongoose = require("mongoose");

const clinicalLocationSchema = new mongoose.Schema(
  {
    hospital: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    department: { type: String, default: "General" },
    level: { type: String, default: "All Years" },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["Upcoming", "Active", "Closed"],
      default: "Active",
    },
    supervisor: { type: String },
    description: { type: String },
    image: { type: String },
    images: [{ type: String }],
    capacity: { type: Number, default: 20 },
    slotsAvailable: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClinicalLocation", clinicalLocationSchema);
