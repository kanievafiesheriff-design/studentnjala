const express = require("express");
const upload = require("../middleware/upload");
const {
  getLeadership,
  createLeader,
  updateLeader,
  deleteLeader,
} = require("../controllers/leadership.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getLeadership);

router.post(
  "/",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "profiles";
    next();
  },
  upload.single("image"),
  createLeader
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "profiles";
    next();
  },
  upload.single("image"),
  updateLeader
);

router.delete("/:id", protect, authorize("admin"), deleteLeader);

module.exports = router;
