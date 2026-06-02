const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: [
        "student",
        "lecturer",
        "leader",
        "clinical_supervisor",
        "admin",
      ],
      default: "student",
    },
    matricNumber: { type: String, unique: true, sparse: true, trim: true },
    level: { type: String, default: "Year 1" },
    department: { type: String, default: "BSc Nursing" },
    phone: { type: String, trim: true },
    profileImage: { type: String },
    idCardCode: { type: String, unique: true, sparse: true, trim: true },
    idCardIssuedAt: { type: Date },
    idCardStatus: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
