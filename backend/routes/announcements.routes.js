const express = require("express");
const upload = require("../middleware/upload");
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcements.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAnnouncements);
router.get("/:id", getAnnouncement);

router.post(
  "/",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "announcements";
    next();
  },
  upload.single("file"),
  createAnnouncement
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "announcements";
    next();
  },
  upload.single("file"),
  updateAnnouncement
);

router.delete("/:id", protect, authorize("admin"), deleteAnnouncement);

module.exports = router;
