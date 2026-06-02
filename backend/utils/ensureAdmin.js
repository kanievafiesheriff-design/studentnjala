const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ensureAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || "admin@nuna.edu.sl").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "NUNA@Admin2026";

  let admin = await User.findOne({ email }).select("+password");

  if (!admin) {
    await User.create({
      name: "System Administrator",
      email,
      password,
      role: "admin",
      matricNumber: "ADMIN001",
      department: "Administration",
    });
    console.log(`Admin account created: ${email}`);
    return;
  }

  const shouldUpdatePassword = !(await admin.matchPassword(password));
  const shouldUpdateRole = admin.role !== "admin";
  const shouldUpdateProfile =
    admin.name !== "System Administrator" || admin.department !== "Administration";

  if (shouldUpdatePassword || shouldUpdateRole || shouldUpdateProfile) {
    if (shouldUpdatePassword) admin.password = password;
    if (shouldUpdateRole) admin.role = "admin";
    if (admin.name !== "System Administrator") admin.name = "System Administrator";
    if (admin.department !== "Administration") admin.department = "Administration";
    if (!admin.matricNumber) admin.matricNumber = "ADMIN001";
    await admin.save();
    console.log(`Admin account ensured/updated: ${email}`);
  }
};

module.exports = ensureAdmin;
