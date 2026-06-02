const express = require("express");
const upload = require("../middleware/upload");
const {
  register,
  login,
  studentLogin,
  getMe,
  updateProfile,
  uploadProfilePhoto,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/student-login", studentLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post(
  "/profile/photo",
  protect,
  (req, res, next) => {
    req.uploadType = "profiles";
    next();
  },
  upload.single("photo"),
  uploadProfilePhoto
);

module.exports = router;
