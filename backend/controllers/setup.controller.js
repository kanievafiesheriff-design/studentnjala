const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

exports.resetAdmin = asyncHandler(async (req, res) => {
  const setupKey = process.env.ADMIN_SETUP_KEY || "nunap-setup-dev";
  const provided = req.headers["x-setup-key"] || req.body?.setupKey;

  if (provided !== setupKey) {
    return res.status(403).json({
      success: false,
      message: "Invalid setup key",
    });
  }

  const email = (process.env.ADMIN_EMAIL || "admin@nuna.edu.sl").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "NUNA@Admin2026";
  const hashed = await bcrypt.hash(password, 12);

  const admin = await User.findOneAndUpdate(
    { email },
    {
      name: "System Administrator",
      email,
      password: hashed,
      role: "admin",
      matricNumber: "ADMIN001",
      department: "Administration",
      idCardStatus: "active",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({
    success: true,
    message: "Admin account ready",
    email: admin.email,
    passwordHint: "Use ADMIN_PASSWORD from server .env",
  });
});
