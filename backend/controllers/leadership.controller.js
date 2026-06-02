const Leadership = require("../models/Leadership");
const asyncHandler = require("../utils/asyncHandler");

exports.getLeadership = asyncHandler(async (req, res) => {
  const leaders = await Leadership.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: leaders.length, data: leaders });
});

exports.createLeader = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.image = `/uploads/profiles/${req.file.filename}`;
  }
  const leader = await Leadership.create(payload);
  res.status(201).json({ success: true, data: leader });
});

exports.updateLeader = asyncHandler(async (req, res) => {
  const leader = await Leadership.findById(req.params.id);
  if (!leader) {
    return res.status(404).json({ success: false, message: "Leader not found" });
  }

  Object.assign(leader, req.body);
  if (req.file) {
    leader.image = `/uploads/profiles/${req.file.filename}`;
  }

  await leader.save();
  res.json({ success: true, data: leader });
});

exports.deleteLeader = asyncHandler(async (req, res) => {
  const leader = await Leadership.findById(req.params.id);
  if (!leader) {
    return res.status(404).json({ success: false, message: "Leader not found" });
  }
  await leader.deleteOne();
  res.json({ success: true, message: "Leader removed" });
});
