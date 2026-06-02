const express = require("express");
const upload = require("../middleware/upload");
const {
  getTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetables.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getTimetables);

router.post(
  "/",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "timetables";
    next();
  },
  upload.single("file"),
  createTimetable
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  (req, res, next) => {
    req.uploadType = "timetables";
    next();
  },
  upload.single("file"),
  updateTimetable
);

router.delete("/:id", protect, authorize("admin"), deleteTimetable);

module.exports = router;
