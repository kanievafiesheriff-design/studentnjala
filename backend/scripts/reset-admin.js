require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const email = (process.env.ADMIN_EMAIL || "admin@nuna.edu.sl").toLowerCase();
const password = process.env.ADMIN_PASSWORD || "NUNA@Admin2026";

async function resetAdmin() {
  await connectDB();

  const hashed = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    {
      name: "System Administrator",
      email,
      password: hashed,
      role: "admin",
      matricNumber: "ADMIN001",
      department: "Administration",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Admin account ready for:", email);
  console.log("\nUse these credentials at /admin/login:");
  console.log("  Email:   ", email);
  console.log("  Password:", password);

  await mongoose.connection.close();
}

resetAdmin().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
