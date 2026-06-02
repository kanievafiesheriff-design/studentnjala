const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

exports.getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, data: user });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (req.body.role) user.role = req.body.role;
  await user.save();

  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(400).json({
      success: false,
      message: "Cannot delete admin account",
    });
  }

  await user.deleteOne();
  res.json({ success: true, message: "User removed" });
});
