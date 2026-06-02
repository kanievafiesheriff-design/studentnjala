const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    yearLevel: {
      type: String,
      enum: ["Year 1", "Year 2", "Year 3", "All Years"],
      default: "Year 1",
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    size: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);
