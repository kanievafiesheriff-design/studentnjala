const path = require("path");
const fs = require("fs");
const ClinicalApplication = require("../models/ClinicalApplication");
const ClinicalLocation = require("../models/ClinicalLocation");
const asyncHandler = require("../utils/asyncHandler");
const { buildApplicationHtml } = require("../utils/applicationDocument");

exports.createApplication = asyncHandler(async (req, res) => {
  const { hospitalId, department, preferredStartDate, reason } = req.body;

  if (!hospitalId || !department || !preferredStartDate || !reason) {
    return res.status(400).json({
      success: false,
      message: "Hospital, department, start date, and reason are required",
    });
  }

  const hospital = await ClinicalLocation.findById(hospitalId);
  if (!hospital) {
    return res.status(404).json({ success: false, message: "Hospital not found" });
  }

  const existing = await ClinicalApplication.findOne({
    student: req.user._id,
    hospital: hospitalId,
    status: "Pending",
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: `You already have a pending application for ${hospital.hospital}`,
    });
  }

  const application = await ClinicalApplication.create({
    student: req.user._id,
    hospital: hospitalId,
    department,
    preferredStartDate,
    reason,
  });

  const populated = await application.populate([
    { path: "student", select: "name email matricNumber level phone" },
    { path: "hospital" },
  ]);

  res.status(201).json({ success: true, data: populated });
});

exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await ClinicalApplication.find({ student: req.user._id })
    .populate("hospital")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: applications.length, data: applications });
});

exports.getAllApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const applications = await ClinicalApplication.find(filter)
    .populate("student", "name email matricNumber level phone")
    .populate("hospital")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: applications.length, data: applications });
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, assignedSupervisor, adminNote } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const application = await ClinicalApplication.findById(req.params.id).populate(
    "hospital"
  );

  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }

  application.status = status;
  if (assignedSupervisor) application.assignedSupervisor = assignedSupervisor;
  if (adminNote !== undefined) application.adminNote = adminNote;

  if (status === "Approved" && application.hospital?.slotsAvailable > 0) {
    application.hospital.slotsAvailable -= 1;
    await application.hospital.save();
  }

  await application.save();

  const populated = await application.populate([
    { path: "student", select: "name email matricNumber level phone" },
    { path: "hospital" },
  ]);

  res.json({ success: true, data: populated });
});

exports.getApplicationFormTemplate = asyncHandler(async (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "forms",
    "clinical-posting-application.pdf"
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "Application form file is not available yet",
    });
  }

  res.download(filePath, "NUNA-Clinical-Posting-Application.pdf");
});

exports.downloadMyApplication = asyncHandler(async (req, res) => {
  const application = await ClinicalApplication.findById(req.params.id)
    .populate("hospital")
    .populate("student", "name email matricNumber level phone department");

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found",
    });
  }

  if (application.student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only download your own applications",
    });
  }

  const html = buildApplicationHtml(application);
  const matric = application.student.matricNumber || "student";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="NUNA-Clinical-Application-${matric}.html"`
  );
  res.send(html);
});

exports.getApplicationStats = asyncHandler(async (req, res) => {
  const [pending, approved, rejected, total] = await Promise.all([
    ClinicalApplication.countDocuments({ status: "Pending" }),
    ClinicalApplication.countDocuments({ status: "Approved" }),
    ClinicalApplication.countDocuments({ status: "Rejected" }),
    ClinicalApplication.countDocuments(),
  ]);

  res.json({
    success: true,
    data: { pending, approved, rejected, total },
  });
});
