const ClinicalLocation = require("../models/ClinicalLocation");
const asyncHandler = require("../utils/asyncHandler");

exports.getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await ClinicalLocation.find().sort({ hospital: 1 });
  res.json({ success: true, count: hospitals.length, data: hospitals });
});

exports.getHospital = asyncHandler(async (req, res) => {
  const hospital = await ClinicalLocation.findById(req.params.id);
  if (!hospital) {
    return res.status(404).json({ success: false, message: "Hospital not found" });
  }
  res.json({ success: true, data: hospital });
});

exports.createHospital = asyncHandler(async (req, res) => {
  const hospital = await ClinicalLocation.create(req.body);
  res.status(201).json({ success: true, data: hospital });
});

exports.updateHospital = asyncHandler(async (req, res) => {
  const hospital = await ClinicalLocation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!hospital) {
    return res.status(404).json({ success: false, message: "Hospital not found" });
  }
  res.json({ success: true, data: hospital });
});

exports.deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await ClinicalLocation.findById(req.params.id);
  if (!hospital) {
    return res.status(404).json({ success: false, message: "Hospital not found" });
  }
  await hospital.deleteOne();
  res.json({ success: true, message: "Hospital removed" });
});

exports.getStats = asyncHandler(async (req, res) => {
  const total = await ClinicalLocation.countDocuments();
  const active = await ClinicalLocation.countDocuments({ status: "Active" });
  res.json({ success: true, data: { total, active } });
});
