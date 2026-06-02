const express = require("express");
const {
  getMyIdCard,
  regenerateIdCard,
  verifyIdCard,
} = require("../controllers/idCard.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/verify/:code", verifyIdCard);
router.get("/me", protect, getMyIdCard);
router.post("/regenerate", protect, regenerateIdCard);

module.exports = router;
