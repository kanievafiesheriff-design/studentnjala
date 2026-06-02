const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");

exports.getAnnouncements = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  const announcements = await Announcement.find(filter)
    .sort({ pinned: -1, createdAt: -1 });

  res.json({ success: true, count: announcements.length, data: announcements });
});

exports.getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ success: false, message: "Announcement not found" });
  }
  res.json({ success: true, data: announcement });
});

exports.createAnnouncement = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };

  if (req.file) {
    payload.fileUrl = `/uploads/announcements/${req.file.filename}`;
    payload.fileName = req.file.originalname;
  }

  const announcement = await Announcement.create(payload);
  res.status(201).json({ success: true, data: announcement });
});

exports.updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ success: false, message: "Announcement not found" });
  }

  Object.assign(announcement, req.body);

  if (req.file) {
    announcement.fileUrl = `/uploads/announcements/${req.file.filename}`;
    announcement.fileName = req.file.originalname;
  }

  await announcement.save();
  res.json({ success: true, data: announcement });
});

exports.deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ success: false, message: "Announcement not found" });
  }
  await announcement.deleteOne();
  res.json({ success: true, message: "Announcement removed" });
});
