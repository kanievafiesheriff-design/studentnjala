const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const {
  ensureUniqueCode,
  formatIdCard,
} = require("../utils/idCard");

async function issueIdCard(user) {
  if (!user.idCardCode) {
    user.idCardCode = await ensureUniqueCode(User);
    user.idCardIssuedAt = new Date();
    user.idCardStatus = "active";
    await user.save();
  }
  return user;
}

exports.getMyIdCard = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Digital student ID is only available for student members",
    });
  }

  if (!req.user.matricNumber) {
    return res.status(400).json({
      success: false,
      message: "Matric number is required before generating a student ID",
    });
  }

  const user = await issueIdCard(req.user);

  res.json({
    success: true,
    data: formatIdCard(user),
  });
});

exports.regenerateIdCard = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Digital student ID is only available for student members",
    });
  }

  req.user.idCardCode = await ensureUniqueCode(User);
  req.user.idCardIssuedAt = new Date();
  req.user.idCardStatus = "active";
  await req.user.save();

  res.json({
    success: true,
    message: "New digital ID issued. Previous QR codes are no longer valid.",
    data: formatIdCard(req.user),
  });
});

exports.verifyIdCard = asyncHandler(async (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();

  if (!code || !code.startsWith("NUNA-")) {
    return res.status(400).json({
      success: false,
      valid: false,
      message: "Invalid ID code format",
    });
  }

  const user = await User.findOne({ idCardCode: code }).select(
    "name matricNumber email level department phone profileImage role idCardCode idCardIssuedAt idCardStatus"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      valid: false,
      message: "ID not found. This QR code may be fake or expired.",
    });
  }

  if (user.role !== "student") {
    return res.json({
      success: true,
      valid: false,
      message: "This card is not a valid student membership ID",
    });
  }

  if (user.idCardStatus === "revoked") {
    return res.json({
      success: true,
      valid: false,
      message: "This digital ID has been revoked",
      data: {
        matricNumber: user.matricNumber,
        status: "revoked",
      },
    });
  }

  res.json({
    success: true,
    valid: true,
    message: "Verified — active NUNA student member",
    data: {
      name: user.name,
      matricNumber: user.matricNumber,
      level: user.level,
      department: user.department,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      issuedAt: user.idCardIssuedAt,
      status: user.idCardStatus,
      verifiedAt: new Date().toISOString(),
    },
  });
});
