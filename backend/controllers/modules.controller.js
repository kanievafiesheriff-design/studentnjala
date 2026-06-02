const Module = require("../models/Module");
const asyncHandler = require("../utils/asyncHandler");

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

exports.getModules = asyncHandler(async (req, res) => {
  const { yearLevel } = req.query;
  const filter = yearLevel && yearLevel !== "All" ? { yearLevel } : {};
  const modules = await Module.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: modules.length, data: modules });
});

exports.createModule = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "PDF file is required" });
  }

  const moduleDoc = await Module.create({
    title: req.body.title,
    description: req.body.description,
    yearLevel: req.body.yearLevel || "Year 1",
    fileUrl: `/uploads/modules/${req.file.filename}`,
    fileName: req.file.originalname,
    size: formatSize(req.file.size),
    uploadedBy: req.user._id,
  });

  res.status(201).json({ success: true, data: moduleDoc });
});

exports.updateModule = asyncHandler(async (req, res) => {
  const moduleDoc = await Module.findById(req.params.id);
  if (!moduleDoc) {
    return res.status(404).json({ success: false, message: "Module not found" });
  }

  if (req.body.title) moduleDoc.title = req.body.title;
  if (req.body.description) moduleDoc.description = req.body.description;
  if (req.body.yearLevel) moduleDoc.yearLevel = req.body.yearLevel;

  if (req.file) {
    moduleDoc.fileUrl = `/uploads/modules/${req.file.filename}`;
    moduleDoc.fileName = req.file.originalname;
    moduleDoc.size = formatSize(req.file.size);
  }

  await moduleDoc.save();
  res.json({ success: true, data: moduleDoc });
});

exports.deleteModule = asyncHandler(async (req, res) => {
  const moduleDoc = await Module.findById(req.params.id);
  if (!moduleDoc) {
    return res.status(404).json({ success: false, message: "Module not found" });
  }
  await moduleDoc.deleteOne();
  res.json({ success: true, message: "Module removed" });
});
