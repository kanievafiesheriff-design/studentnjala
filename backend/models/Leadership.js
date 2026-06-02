const mongoose = require("mongoose");

const leadershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    image: { type: String },
    contact: { type: String },
    bio: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leadership", leadershipSchema);
