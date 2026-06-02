const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { ensureUniqueCode } = require("../utils/idCard");

const uploadRoot = path.join(__dirname, "..", "uploads");

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  matricNumber: user.matricNumber,
  level: user.level,
  department: user.department,
  phone: user.phone,
  profileImage: user.profileImage,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, matricNumber, level, department, phone } = req.body;

  if (!name || !email || !password || !matricNumber) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, and matric number are required",
    });
  }

  const exists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { matricNumber }],
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Email or matric number already registered",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    matricNumber,
    level,
    department,
    phone,
    role: "student",
    idCardCode: await ensureUniqueCode(User),
    idCardIssuedAt: new Date(),
    idCardStatus: "active",
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, matricNumber, password } = req.body;

  if (!password || (!email && !matricNumber)) {
    return res.status(400).json({
      success: false,
      message: "Provide email or matric number and password",
    });
  }

  const query = email
    ? { email: email.toLowerCase() }
    : { matricNumber };

  const user = await User.findOne(query).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

exports.studentLogin = asyncHandler(async (req, res) => {
  const { studentId, fullName, email, phone, yearLevel, department } = req.body;

  if (!studentId || !fullName || !email) {
    return res.status(400).json({
      success: false,
      message: "Student ID, name, and email are required",
    });
  }

  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({
    $or: [{ matricNumber: studentId }, { email: normalizedEmail }],
  });

  if (user) {
    user.name = fullName;
    user.email = normalizedEmail;
    user.phone = phone;
    user.level = yearLevel || user.level;
    if (department !== undefined) user.department = department;
    await user.save();
  } else {
    const password = crypto.randomBytes(16).toString("hex");
    user = await User.create({
      name: fullName,
      email: normalizedEmail,
      password,
      matricNumber: studentId,
      phone,
      level: yearLevel,
      department,
      role: "student",
    });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: formatUser(user),
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: formatUser(req.user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, level, department, phone } = req.body;

  if (req.user.role === "student") {
    if (name !== undefined) req.user.name = String(name).trim();
    if (level !== undefined) req.user.level = level;
    if (department !== undefined) req.user.department = String(department).trim();
    if (phone !== undefined) req.user.phone = String(phone).trim();
  } else {
    const fields = ["name", "level", "department", "phone", "profileImage"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });
  }

  await req.user.save();
  res.json({ success: true, user: formatUser(req.user) });
});

exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only students can upload a membership photo",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please choose a photo (JPG, PNG, or WebP, max 5MB)",
    });
  }

  if (req.user.profileImage?.startsWith("/uploads/profiles/")) {
    const oldPath = path.join(
      uploadRoot,
      "profiles",
      path.basename(req.user.profileImage)
    );
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  req.user.profileImage = `/uploads/profiles/${req.file.filename}`;
  await req.user.save();

  res.json({ success: true, user: formatUser(req.user) });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });

  if (!user) {
    return res.json({
      success: true,
      message: "If that email exists, a reset link was sent",
    });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // In production, email the resetToken to the user
  res.json({
    success: true,
    message: "Password reset token generated",
    resetToken,
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    token: generateToken(user._id),
    user: formatUser(user),
  });
});
