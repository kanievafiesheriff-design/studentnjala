const express = require("express");
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats,
  getApplicationFormTemplate,
  downloadMyApplication,
} = require("../controllers/applications.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("student"), createApplication);
router.get("/form-template", authorize("student"), getApplicationFormTemplate);
router.get("/me", authorize("student"), getMyApplications);
router.get("/stats", authorize("admin", "clinical_supervisor"), getApplicationStats);
router.get("/", authorize("admin", "clinical_supervisor"), getAllApplications);
router.get("/:id/download", authorize("student"), downloadMyApplication);
router.patch(
  "/:id/status",
  authorize("admin", "clinical_supervisor"),
  updateApplicationStatus
);

module.exports = router;
