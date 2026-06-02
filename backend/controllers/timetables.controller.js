const Timetable = require("../models/Timetable");
const asyncHandler = require("../utils/asyncHandler");

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

exports.getTimetables = asyncHandler(async (req, res) => {
  const { yearLevel } = req.query;
  const filter = yearLevel && yearLevel !== "All" ? { yearLevel } : {};
  const timetables = await Timetable.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: timetables.length, data: timetables });
});

exports.createTimetable = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "PDF file is required" });
  }

  const timetable = await Timetable.create({
    title: req.body.title,
    description: req.body.description,
    program: req.body.program || "BSc Nursing",
    yearLevel: req.body.yearLevel || "All Years",
    fileUrl: `/uploads/timetables/${req.file.filename}`,
    fileName: req.file.originalname,
    size: formatSize(req.file.size),
    uploadedBy: req.user._id,
  });

  res.status(201).json({ success: true, data: timetable });
});

exports.updateTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    return res.status(404).json({ success: false, message: "Timetable not found" });
  }

  if (req.body.title) timetable.title = req.body.title;
  if (req.body.description) timetable.description = req.body.description;
  if (req.body.program) timetable.program = req.body.program;
  if (req.body.yearLevel) timetable.yearLevel = req.body.yearLevel;

  if (req.file) {
    timetable.fileUrl = `/uploads/timetables/${req.file.filename}`;
    timetable.fileName = req.file.originalname;
    timetable.size = formatSize(req.file.size);
  }

  await timetable.save();
  res.json({ success: true, data: timetable });
});

exports.deleteTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    return res.status(404).json({ success: false, message: "Timetable not found" });
  }
  await timetable.deleteOne();
  res.json({ success: true, message: "Timetable removed" });
});
