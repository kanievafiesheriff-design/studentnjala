const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Announcement",
        "News",
        "Update",
        "Clinical Posting",
        "Academic",
        "Clinical",
        "Events",
        "General",
      ],
      default: "Announcement",
    },
    author: { type: String, default: "Faculty Office" },
    pinned: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    fileUrl: { type: String },
    fileName: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
