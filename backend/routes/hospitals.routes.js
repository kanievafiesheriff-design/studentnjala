const express = require("express");
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getStats,
} = require("../controllers/hospitals.controller");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getHospitals);
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/:id", getHospital);

router.post("/", protect, authorize("admin"), createHospital);
router.put("/:id", protect, authorize("admin"), updateHospital);
router.delete("/:id", protect, authorize("admin"), deleteHospital);

module.exports = router;
