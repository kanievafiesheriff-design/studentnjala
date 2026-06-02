const mongoose = require("mongoose");

const clinicalApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalLocation",
      required: true,
    },
    department: { type: String, required: true },
    preferredStartDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    assignedSupervisor: { type: String },
    adminNote: { type: String },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

clinicalApplicationSchema.index({ student: 1, hospital: 1, status: 1 });

module.exports = mongoose.model("ClinicalApplication", clinicalApplicationSchema);
